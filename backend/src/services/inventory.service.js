import Inventory from '../models/Inventory.js';

export class InventoryService {
  /**
   * Atomically reserve stock for line items using conditional $inc
   * @param {Array<{ productId: string, quantity: number, sellerId: string }>} items
   */
  static async reserveStock(items, session = null) {
    const reservations = [];

    for (const item of items) {
      const filter = {
        productId: item.productId,
        availableQty: { $gte: item.quantity }
      };
      if (item.sellerId) {
        filter.sellerId = item.sellerId;
      }

      const updated = await Inventory.findOneAndUpdate(
        filter,
        {
          $inc: {
            availableQty: -item.quantity,
            reservedQty: item.quantity,
            version: 1
          },
          $set: { updatedAt: new Date() }
        },
        { new: true, session }
      );

      if (!updated) {
        // Rollback previous reservations in this request if any
        if (!session && reservations.length > 0) {
          await this.releaseReservedStock(reservations);
        }
        throw new Error(
          `INSUFFICIENT_STOCK: Item ${item.name || item.productId} has insufficient available stock for requested quantity (${item.quantity}).`
        );
      }

      reservations.push({
        inventoryId: updated._id,
        quantity: item.quantity,
        batchNumber: updated.batchNumber,
        expiryDate: updated.expiryDate,
        sellerId: updated.sellerId
      });
    }

    return reservations;
  }

  static async releaseReservedStock(reservations, session = null) {
    for (const r of reservations) {
      await Inventory.findByIdAndUpdate(
        r.inventoryId,
        {
          $inc: {
            availableQty: r.quantity,
            reservedQty: -r.quantity
          }
        },
        { session }
      );
    }
  }

  static async commitReservedStock(reservations, session = null) {
    for (const r of reservations) {
      await Inventory.findByIdAndUpdate(
        r.inventoryId,
        {
          $inc: {
            reservedQty: -r.quantity
          }
        },
        { session }
      );
    }
  }
}
