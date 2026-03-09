
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  name: 'name',
  role: 'role',
  emailVerified: 'emailVerified',
  verificationToken: 'verificationToken',
  verificationTokenExpires: 'verificationTokenExpires',
  resetPasswordToken: 'resetPasswordToken',
  resetPasswordExpires: 'resetPasswordExpires',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClientProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  razonSocial: 'razonSocial',
  nif: 'nif',
  phone: 'phone',
  urlClientify: 'urlClientify',
  accountType: 'accountType',
  recetasContratadas: 'recetasContratadas',
  canManageRecipes: 'canManageRecipes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RecipeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  clientProfileId: 'clientProfileId',
  lotesMandatory: 'lotesMandatory',
  quantitiesMandatory: 'quantitiesMandatory',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.IngredientScalarFieldEnum = {
  id: 'id',
  recipeId: 'recipeId',
  name: 'name',
  amount: 'amount',
  unit: 'unit',
  loteMandatory: 'loteMandatory',
  quantityMandatory: 'quantityMandatory',
  createdAt: 'createdAt'
};

exports.Prisma.ElaborationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  date: 'date',
  recipeId: 'recipeId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ElaborationIngredientScalarFieldEnum = {
  id: 'id',
  elaborationId: 'elaborationId',
  name: 'name',
  lote: 'lote',
  realAmount: 'realAmount',
  unit: 'unit',
  createdAt: 'createdAt'
};

exports.Prisma.CleaningZoneScalarFieldEnum = {
  id: 'id',
  name: 'name',
  clientProfileId: 'clientProfileId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CleaningLogScalarFieldEnum = {
  id: 'id',
  personName: 'personName',
  date: 'date',
  clientProfileId: 'clientProfileId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CleaningLogZoneScalarFieldEnum = {
  cleaningLogId: 'cleaningLogId',
  cleaningZoneId: 'cleaningZoneId'
};

exports.Prisma.ChamberScalarFieldEnum = {
  id: 'id',
  name: 'name',
  clientProfileId: 'clientProfileId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TemperatureRecordScalarFieldEnum = {
  id: 'id',
  date: 'date',
  clientProfileId: 'clientProfileId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TemperatureValueScalarFieldEnum = {
  id: 'id',
  value: 'value',
  chamberId: 'chamberId',
  temperatureRecordId: 'temperatureRecordId'
};

exports.Prisma.GoodsReceiptScalarFieldEnum = {
  id: 'id',
  providerName: 'providerName',
  productName: 'productName',
  lote: 'lote',
  invoiceNumber: 'invoiceNumber',
  quantity: 'quantity',
  date: 'date',
  deliveryNoteImage: 'deliveryNoteImage',
  clientProfileId: 'clientProfileId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  ClientProfile: 'ClientProfile',
  Recipe: 'Recipe',
  Ingredient: 'Ingredient',
  Elaboration: 'Elaboration',
  ElaborationIngredient: 'ElaborationIngredient',
  CleaningZone: 'CleaningZone',
  CleaningLog: 'CleaningLog',
  CleaningLogZone: 'CleaningLogZone',
  Chamber: 'Chamber',
  TemperatureRecord: 'TemperatureRecord',
  TemperatureValue: 'TemperatureValue',
  GoodsReceipt: 'GoodsReceipt'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
