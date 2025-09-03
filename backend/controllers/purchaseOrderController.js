// controllers/purchaseOrderController.js
const db = require('../models');
const { PurchaseOrder, PurchaseOrderItem, Supplier, Item } = db;
const sequelize = db.sequelize;

// 1. Get all POs
exports.getAllPOs = async (req, res) => {
    try {
        const pos = await PurchaseOrder.findAll({
            include: [{ model: Supplier, attributes: ['supplier_name'] }],
            order: [['order_date', 'DESC']]
        });
        res.status(200).json(pos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Get a single PO with all its details
exports.getPOById = async (req, res) => {
    try {
        const po = await PurchaseOrder.findByPk(req.params.id, {
            include: [
                { model: Supplier },
                { 
                    model: PurchaseOrderItem,
                    include: [{ model: Item, attributes: ['item_name'] }]
                }
            ]
        });
        if (!po) return res.status(404).json({ message: 'PO not found' });
        res.status(200).json(po);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Create a new PO (TRANSACTIONAL)
exports.createPO = async (req, res) => {
    const { supplier_id, items } = req.body; // items = [{item_id, quantity, price}]
    const t = await sequelize.transaction();
    try {
        let totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        
        const po = await PurchaseOrder.create(
            { supplier_id, total_amount: totalAmount },
            { transaction: t }
        );

        const poItems = items.map(item => ({ ...item, po_id: po.po_id }));
        await PurchaseOrderItem.bulkCreate(poItems, { transaction: t });

        await t.commit();
        res.status(201).json(po);
    } catch (err) {
        await t.rollback();
        res.status(400).json({ error: err.message });
    }
};

// 4. Update PO Status
exports.updatePOStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const [updated] = await PurchaseOrder.update(
            { status },
            { where: { po_id: id } }
        );
        if (!updated) return res.status(404).json({ message: 'PO not found' });
        res.status(200).json({ message: 'Status updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
