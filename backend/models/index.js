// models/index.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

// Create Sequelize instance using .env values
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // disable logs
  }
);

const Hostel = require('./Hostel');
const Warden = require('./Warden');
const RoomType = require('./RoomType');
const HostelRoom = require('./HostelRoom');
const Session = require('./Session');
const Student = require('./Student');
const Enrollment = require('./Enrollment');
const HostelMaintenance = require('./HostelMaintenance');
const SupplierManagement = require('./Supplier');
const Supplier = require('./Supplier');
const ItemCategory = require('./ItemCategory');
const UOM = require('./UOM');
const Item = require('./Item');
const PurchaseOrder = require('./PurchaseOrder');
const PurchaseOrderItem = require('./PurchaseOrderItem');
const Groceries = require('./Groceries');
const ItemStock = require('./ItemStock');
const DailyConsumption = require('./DailyConsumption');
const Menu = require('./Menu');
const MenuItem = require('./MenuItem');
const MenuSchedule = require('./MenuSchedule');
const Attendance = require('./Attendance');
const MessBill = require('./MessBill')
const StudentAdmission = require('./StudentAdmission');
// A Warden can be in charge of many Hostels (One-to-Many)
Warden.hasMany(Hostel, { foreignKey: 'warden_id' });

// A Hostel belongs to exactly one Warden (Many-to-One)
Hostel.belongsTo(Warden, { foreignKey: 'warden_id' });

Hostel.hasMany(HostelRoom, { foreignKey: 'hostel_id' });
HostelRoom.belongsTo(Hostel, { foreignKey: 'hostel_id' });

// A RoomType can be used for many HostelRooms
RoomType.hasMany(HostelRoom, { foreignKey: 'room_type_id' });
HostelRoom.belongsTo(RoomType, { foreignKey: 'room_type_id' });

Student.hasMany(Enrollment, { foreignKey: 'student_id' });
Enrollment.belongsTo(Student, { foreignKey: 'student_id' });

HostelRoom.hasMany(Enrollment, { foreignKey: 'room_id' });
Enrollment.belongsTo(HostelRoom, { foreignKey: 'room_id' });

Session.hasMany(Enrollment, { foreignKey: 'session_id' });
Enrollment.belongsTo(Session, { foreignKey: 'session_id' });

HostelRoom.hasMany(HostelMaintenance, { foreignKey: 'room_id' });
HostelMaintenance.belongsTo(HostelRoom, { foreignKey: 'room_id' });

Student.hasMany(HostelMaintenance, { foreignKey: 'reported_by_student_id' });
HostelMaintenance.belongsTo(Student, { as: 'Reporter', foreignKey: 'reported_by_student_id' });

ItemCategory.hasMany(Item, { foreignKey: 'category_id' });
Item.belongsTo(ItemCategory, { foreignKey: 'category_id' });

UOM.hasMany(Item, { foreignKey: 'uom_id' });
Item.belongsTo(UOM, { foreignKey: 'uom_id' });

Supplier.hasMany(PurchaseOrder, { foreignKey: 'supplier_id' });
PurchaseOrder.belongsTo(Supplier, { foreignKey: 'supplier_id' });

PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: 'po_id' });
PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: 'po_id' });

Item.hasMany(PurchaseOrderItem, { foreignKey: 'item_id' });
PurchaseOrderItem.belongsTo(Item, { foreignKey: 'item_id' });

Item.hasOne(ItemStock, { foreignKey: 'item_id' });
ItemStock.belongsTo(Item, { foreignKey: 'item_id' });

Item.hasMany(DailyConsumption, { foreignKey: 'item_id' });
DailyConsumption.belongsTo(Item, { foreignKey: 'item_id' });

Menu.hasMany(MenuItem, { foreignKey: 'menu_id' });
MenuItem.belongsTo(Menu, { foreignKey: 'menu_id' });

Item.hasMany(MenuItem, { foreignKey: 'item_id' });
MenuItem.belongsTo(Item, { foreignKey: 'item_id' });

Menu.hasMany(MenuSchedule, { foreignKey: 'menu_id' });
MenuSchedule.belongsTo(Menu, { foreignKey: 'menu_id' });

Student.hasMany(Attendance, { foreignKey: 'student_id' });
Attendance.belongsTo(Student, { foreignKey: 'student_id' });

Student.hasMany(MessBill, { foreignKey: 'student_id' });
MessBill.belongsTo(Student, { foreignKey: 'student_id' });

Session.hasMany(MessBill, { foreignKey: 'session_id' });
MessBill.belongsTo(Session, { foreignKey: 'session_id' });

// Export models for use elsewhere if needed
module.exports = {
  Hostel,
  Warden,
  RoomType,
  HostelRoom,
  Session,
  Student,
  Enrollment,
  HostelMaintenance,
  SupplierManagement,
  Supplier,
  ItemCategory,
  UOM,
  Item,
  PurchaseOrder,
  PurchaseOrderItem,
  Groceries,
  ItemStock,
  DailyConsumption,
  Menu,
  MenuItem,
  MenuSchedule,
  Attendance,
  MessBill,
  StudentAdmission,
  sequelize
};
