
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model ClientProfile
 * 
 */
export type ClientProfile = $Result.DefaultSelection<Prisma.$ClientProfilePayload>
/**
 * Model Recipe
 * 
 */
export type Recipe = $Result.DefaultSelection<Prisma.$RecipePayload>
/**
 * Model Ingredient
 * 
 */
export type Ingredient = $Result.DefaultSelection<Prisma.$IngredientPayload>
/**
 * Model Elaboration
 * 
 */
export type Elaboration = $Result.DefaultSelection<Prisma.$ElaborationPayload>
/**
 * Model ElaborationIngredient
 * 
 */
export type ElaborationIngredient = $Result.DefaultSelection<Prisma.$ElaborationIngredientPayload>
/**
 * Model CleaningZone
 * 
 */
export type CleaningZone = $Result.DefaultSelection<Prisma.$CleaningZonePayload>
/**
 * Model CleaningLog
 * 
 */
export type CleaningLog = $Result.DefaultSelection<Prisma.$CleaningLogPayload>
/**
 * Model CleaningLogZone
 * 
 */
export type CleaningLogZone = $Result.DefaultSelection<Prisma.$CleaningLogZonePayload>
/**
 * Model Chamber
 * 
 */
export type Chamber = $Result.DefaultSelection<Prisma.$ChamberPayload>
/**
 * Model TemperatureRecord
 * 
 */
export type TemperatureRecord = $Result.DefaultSelection<Prisma.$TemperatureRecordPayload>
/**
 * Model TemperatureValue
 * 
 */
export type TemperatureValue = $Result.DefaultSelection<Prisma.$TemperatureValuePayload>
/**
 * Model GoodsReceipt
 * 
 */
export type GoodsReceipt = $Result.DefaultSelection<Prisma.$GoodsReceiptPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.clientProfile`: Exposes CRUD operations for the **ClientProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClientProfiles
    * const clientProfiles = await prisma.clientProfile.findMany()
    * ```
    */
  get clientProfile(): Prisma.ClientProfileDelegate<ExtArgs>;

  /**
   * `prisma.recipe`: Exposes CRUD operations for the **Recipe** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Recipes
    * const recipes = await prisma.recipe.findMany()
    * ```
    */
  get recipe(): Prisma.RecipeDelegate<ExtArgs>;

  /**
   * `prisma.ingredient`: Exposes CRUD operations for the **Ingredient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ingredients
    * const ingredients = await prisma.ingredient.findMany()
    * ```
    */
  get ingredient(): Prisma.IngredientDelegate<ExtArgs>;

  /**
   * `prisma.elaboration`: Exposes CRUD operations for the **Elaboration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Elaborations
    * const elaborations = await prisma.elaboration.findMany()
    * ```
    */
  get elaboration(): Prisma.ElaborationDelegate<ExtArgs>;

  /**
   * `prisma.elaborationIngredient`: Exposes CRUD operations for the **ElaborationIngredient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ElaborationIngredients
    * const elaborationIngredients = await prisma.elaborationIngredient.findMany()
    * ```
    */
  get elaborationIngredient(): Prisma.ElaborationIngredientDelegate<ExtArgs>;

  /**
   * `prisma.cleaningZone`: Exposes CRUD operations for the **CleaningZone** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CleaningZones
    * const cleaningZones = await prisma.cleaningZone.findMany()
    * ```
    */
  get cleaningZone(): Prisma.CleaningZoneDelegate<ExtArgs>;

  /**
   * `prisma.cleaningLog`: Exposes CRUD operations for the **CleaningLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CleaningLogs
    * const cleaningLogs = await prisma.cleaningLog.findMany()
    * ```
    */
  get cleaningLog(): Prisma.CleaningLogDelegate<ExtArgs>;

  /**
   * `prisma.cleaningLogZone`: Exposes CRUD operations for the **CleaningLogZone** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CleaningLogZones
    * const cleaningLogZones = await prisma.cleaningLogZone.findMany()
    * ```
    */
  get cleaningLogZone(): Prisma.CleaningLogZoneDelegate<ExtArgs>;

  /**
   * `prisma.chamber`: Exposes CRUD operations for the **Chamber** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Chambers
    * const chambers = await prisma.chamber.findMany()
    * ```
    */
  get chamber(): Prisma.ChamberDelegate<ExtArgs>;

  /**
   * `prisma.temperatureRecord`: Exposes CRUD operations for the **TemperatureRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TemperatureRecords
    * const temperatureRecords = await prisma.temperatureRecord.findMany()
    * ```
    */
  get temperatureRecord(): Prisma.TemperatureRecordDelegate<ExtArgs>;

  /**
   * `prisma.temperatureValue`: Exposes CRUD operations for the **TemperatureValue** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TemperatureValues
    * const temperatureValues = await prisma.temperatureValue.findMany()
    * ```
    */
  get temperatureValue(): Prisma.TemperatureValueDelegate<ExtArgs>;

  /**
   * `prisma.goodsReceipt`: Exposes CRUD operations for the **GoodsReceipt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GoodsReceipts
    * const goodsReceipts = await prisma.goodsReceipt.findMany()
    * ```
    */
  get goodsReceipt(): Prisma.GoodsReceiptDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "clientProfile" | "recipe" | "ingredient" | "elaboration" | "elaborationIngredient" | "cleaningZone" | "cleaningLog" | "cleaningLogZone" | "chamber" | "temperatureRecord" | "temperatureValue" | "goodsReceipt"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      ClientProfile: {
        payload: Prisma.$ClientProfilePayload<ExtArgs>
        fields: Prisma.ClientProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClientProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClientProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientProfilePayload>
          }
          findFirst: {
            args: Prisma.ClientProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClientProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientProfilePayload>
          }
          findMany: {
            args: Prisma.ClientProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientProfilePayload>[]
          }
          create: {
            args: Prisma.ClientProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientProfilePayload>
          }
          createMany: {
            args: Prisma.ClientProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClientProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientProfilePayload>[]
          }
          delete: {
            args: Prisma.ClientProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientProfilePayload>
          }
          update: {
            args: Prisma.ClientProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientProfilePayload>
          }
          deleteMany: {
            args: Prisma.ClientProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClientProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClientProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientProfilePayload>
          }
          aggregate: {
            args: Prisma.ClientProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClientProfile>
          }
          groupBy: {
            args: Prisma.ClientProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClientProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClientProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ClientProfileCountAggregateOutputType> | number
          }
        }
      }
      Recipe: {
        payload: Prisma.$RecipePayload<ExtArgs>
        fields: Prisma.RecipeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RecipeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RecipeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipePayload>
          }
          findFirst: {
            args: Prisma.RecipeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RecipeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipePayload>
          }
          findMany: {
            args: Prisma.RecipeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipePayload>[]
          }
          create: {
            args: Prisma.RecipeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipePayload>
          }
          createMany: {
            args: Prisma.RecipeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RecipeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipePayload>[]
          }
          delete: {
            args: Prisma.RecipeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipePayload>
          }
          update: {
            args: Prisma.RecipeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipePayload>
          }
          deleteMany: {
            args: Prisma.RecipeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RecipeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RecipeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecipePayload>
          }
          aggregate: {
            args: Prisma.RecipeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRecipe>
          }
          groupBy: {
            args: Prisma.RecipeGroupByArgs<ExtArgs>
            result: $Utils.Optional<RecipeGroupByOutputType>[]
          }
          count: {
            args: Prisma.RecipeCountArgs<ExtArgs>
            result: $Utils.Optional<RecipeCountAggregateOutputType> | number
          }
        }
      }
      Ingredient: {
        payload: Prisma.$IngredientPayload<ExtArgs>
        fields: Prisma.IngredientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IngredientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IngredientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload>
          }
          findFirst: {
            args: Prisma.IngredientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IngredientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload>
          }
          findMany: {
            args: Prisma.IngredientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload>[]
          }
          create: {
            args: Prisma.IngredientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload>
          }
          createMany: {
            args: Prisma.IngredientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IngredientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload>[]
          }
          delete: {
            args: Prisma.IngredientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload>
          }
          update: {
            args: Prisma.IngredientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload>
          }
          deleteMany: {
            args: Prisma.IngredientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IngredientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.IngredientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngredientPayload>
          }
          aggregate: {
            args: Prisma.IngredientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIngredient>
          }
          groupBy: {
            args: Prisma.IngredientGroupByArgs<ExtArgs>
            result: $Utils.Optional<IngredientGroupByOutputType>[]
          }
          count: {
            args: Prisma.IngredientCountArgs<ExtArgs>
            result: $Utils.Optional<IngredientCountAggregateOutputType> | number
          }
        }
      }
      Elaboration: {
        payload: Prisma.$ElaborationPayload<ExtArgs>
        fields: Prisma.ElaborationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ElaborationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ElaborationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationPayload>
          }
          findFirst: {
            args: Prisma.ElaborationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ElaborationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationPayload>
          }
          findMany: {
            args: Prisma.ElaborationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationPayload>[]
          }
          create: {
            args: Prisma.ElaborationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationPayload>
          }
          createMany: {
            args: Prisma.ElaborationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ElaborationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationPayload>[]
          }
          delete: {
            args: Prisma.ElaborationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationPayload>
          }
          update: {
            args: Prisma.ElaborationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationPayload>
          }
          deleteMany: {
            args: Prisma.ElaborationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ElaborationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ElaborationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationPayload>
          }
          aggregate: {
            args: Prisma.ElaborationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateElaboration>
          }
          groupBy: {
            args: Prisma.ElaborationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ElaborationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ElaborationCountArgs<ExtArgs>
            result: $Utils.Optional<ElaborationCountAggregateOutputType> | number
          }
        }
      }
      ElaborationIngredient: {
        payload: Prisma.$ElaborationIngredientPayload<ExtArgs>
        fields: Prisma.ElaborationIngredientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ElaborationIngredientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationIngredientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ElaborationIngredientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationIngredientPayload>
          }
          findFirst: {
            args: Prisma.ElaborationIngredientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationIngredientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ElaborationIngredientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationIngredientPayload>
          }
          findMany: {
            args: Prisma.ElaborationIngredientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationIngredientPayload>[]
          }
          create: {
            args: Prisma.ElaborationIngredientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationIngredientPayload>
          }
          createMany: {
            args: Prisma.ElaborationIngredientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ElaborationIngredientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationIngredientPayload>[]
          }
          delete: {
            args: Prisma.ElaborationIngredientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationIngredientPayload>
          }
          update: {
            args: Prisma.ElaborationIngredientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationIngredientPayload>
          }
          deleteMany: {
            args: Prisma.ElaborationIngredientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ElaborationIngredientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ElaborationIngredientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ElaborationIngredientPayload>
          }
          aggregate: {
            args: Prisma.ElaborationIngredientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateElaborationIngredient>
          }
          groupBy: {
            args: Prisma.ElaborationIngredientGroupByArgs<ExtArgs>
            result: $Utils.Optional<ElaborationIngredientGroupByOutputType>[]
          }
          count: {
            args: Prisma.ElaborationIngredientCountArgs<ExtArgs>
            result: $Utils.Optional<ElaborationIngredientCountAggregateOutputType> | number
          }
        }
      }
      CleaningZone: {
        payload: Prisma.$CleaningZonePayload<ExtArgs>
        fields: Prisma.CleaningZoneFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CleaningZoneFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningZonePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CleaningZoneFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningZonePayload>
          }
          findFirst: {
            args: Prisma.CleaningZoneFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningZonePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CleaningZoneFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningZonePayload>
          }
          findMany: {
            args: Prisma.CleaningZoneFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningZonePayload>[]
          }
          create: {
            args: Prisma.CleaningZoneCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningZonePayload>
          }
          createMany: {
            args: Prisma.CleaningZoneCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CleaningZoneCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningZonePayload>[]
          }
          delete: {
            args: Prisma.CleaningZoneDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningZonePayload>
          }
          update: {
            args: Prisma.CleaningZoneUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningZonePayload>
          }
          deleteMany: {
            args: Prisma.CleaningZoneDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CleaningZoneUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CleaningZoneUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningZonePayload>
          }
          aggregate: {
            args: Prisma.CleaningZoneAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCleaningZone>
          }
          groupBy: {
            args: Prisma.CleaningZoneGroupByArgs<ExtArgs>
            result: $Utils.Optional<CleaningZoneGroupByOutputType>[]
          }
          count: {
            args: Prisma.CleaningZoneCountArgs<ExtArgs>
            result: $Utils.Optional<CleaningZoneCountAggregateOutputType> | number
          }
        }
      }
      CleaningLog: {
        payload: Prisma.$CleaningLogPayload<ExtArgs>
        fields: Prisma.CleaningLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CleaningLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CleaningLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogPayload>
          }
          findFirst: {
            args: Prisma.CleaningLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CleaningLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogPayload>
          }
          findMany: {
            args: Prisma.CleaningLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogPayload>[]
          }
          create: {
            args: Prisma.CleaningLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogPayload>
          }
          createMany: {
            args: Prisma.CleaningLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CleaningLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogPayload>[]
          }
          delete: {
            args: Prisma.CleaningLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogPayload>
          }
          update: {
            args: Prisma.CleaningLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogPayload>
          }
          deleteMany: {
            args: Prisma.CleaningLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CleaningLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CleaningLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogPayload>
          }
          aggregate: {
            args: Prisma.CleaningLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCleaningLog>
          }
          groupBy: {
            args: Prisma.CleaningLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<CleaningLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.CleaningLogCountArgs<ExtArgs>
            result: $Utils.Optional<CleaningLogCountAggregateOutputType> | number
          }
        }
      }
      CleaningLogZone: {
        payload: Prisma.$CleaningLogZonePayload<ExtArgs>
        fields: Prisma.CleaningLogZoneFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CleaningLogZoneFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogZonePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CleaningLogZoneFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogZonePayload>
          }
          findFirst: {
            args: Prisma.CleaningLogZoneFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogZonePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CleaningLogZoneFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogZonePayload>
          }
          findMany: {
            args: Prisma.CleaningLogZoneFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogZonePayload>[]
          }
          create: {
            args: Prisma.CleaningLogZoneCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogZonePayload>
          }
          createMany: {
            args: Prisma.CleaningLogZoneCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CleaningLogZoneCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogZonePayload>[]
          }
          delete: {
            args: Prisma.CleaningLogZoneDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogZonePayload>
          }
          update: {
            args: Prisma.CleaningLogZoneUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogZonePayload>
          }
          deleteMany: {
            args: Prisma.CleaningLogZoneDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CleaningLogZoneUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CleaningLogZoneUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CleaningLogZonePayload>
          }
          aggregate: {
            args: Prisma.CleaningLogZoneAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCleaningLogZone>
          }
          groupBy: {
            args: Prisma.CleaningLogZoneGroupByArgs<ExtArgs>
            result: $Utils.Optional<CleaningLogZoneGroupByOutputType>[]
          }
          count: {
            args: Prisma.CleaningLogZoneCountArgs<ExtArgs>
            result: $Utils.Optional<CleaningLogZoneCountAggregateOutputType> | number
          }
        }
      }
      Chamber: {
        payload: Prisma.$ChamberPayload<ExtArgs>
        fields: Prisma.ChamberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChamberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChamberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamberPayload>
          }
          findFirst: {
            args: Prisma.ChamberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChamberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamberPayload>
          }
          findMany: {
            args: Prisma.ChamberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamberPayload>[]
          }
          create: {
            args: Prisma.ChamberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamberPayload>
          }
          createMany: {
            args: Prisma.ChamberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChamberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamberPayload>[]
          }
          delete: {
            args: Prisma.ChamberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamberPayload>
          }
          update: {
            args: Prisma.ChamberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamberPayload>
          }
          deleteMany: {
            args: Prisma.ChamberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChamberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ChamberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChamberPayload>
          }
          aggregate: {
            args: Prisma.ChamberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChamber>
          }
          groupBy: {
            args: Prisma.ChamberGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChamberGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChamberCountArgs<ExtArgs>
            result: $Utils.Optional<ChamberCountAggregateOutputType> | number
          }
        }
      }
      TemperatureRecord: {
        payload: Prisma.$TemperatureRecordPayload<ExtArgs>
        fields: Prisma.TemperatureRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TemperatureRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TemperatureRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureRecordPayload>
          }
          findFirst: {
            args: Prisma.TemperatureRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TemperatureRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureRecordPayload>
          }
          findMany: {
            args: Prisma.TemperatureRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureRecordPayload>[]
          }
          create: {
            args: Prisma.TemperatureRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureRecordPayload>
          }
          createMany: {
            args: Prisma.TemperatureRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TemperatureRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureRecordPayload>[]
          }
          delete: {
            args: Prisma.TemperatureRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureRecordPayload>
          }
          update: {
            args: Prisma.TemperatureRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureRecordPayload>
          }
          deleteMany: {
            args: Prisma.TemperatureRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TemperatureRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TemperatureRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureRecordPayload>
          }
          aggregate: {
            args: Prisma.TemperatureRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTemperatureRecord>
          }
          groupBy: {
            args: Prisma.TemperatureRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<TemperatureRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.TemperatureRecordCountArgs<ExtArgs>
            result: $Utils.Optional<TemperatureRecordCountAggregateOutputType> | number
          }
        }
      }
      TemperatureValue: {
        payload: Prisma.$TemperatureValuePayload<ExtArgs>
        fields: Prisma.TemperatureValueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TemperatureValueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureValuePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TemperatureValueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureValuePayload>
          }
          findFirst: {
            args: Prisma.TemperatureValueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureValuePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TemperatureValueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureValuePayload>
          }
          findMany: {
            args: Prisma.TemperatureValueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureValuePayload>[]
          }
          create: {
            args: Prisma.TemperatureValueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureValuePayload>
          }
          createMany: {
            args: Prisma.TemperatureValueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TemperatureValueCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureValuePayload>[]
          }
          delete: {
            args: Prisma.TemperatureValueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureValuePayload>
          }
          update: {
            args: Prisma.TemperatureValueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureValuePayload>
          }
          deleteMany: {
            args: Prisma.TemperatureValueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TemperatureValueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TemperatureValueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemperatureValuePayload>
          }
          aggregate: {
            args: Prisma.TemperatureValueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTemperatureValue>
          }
          groupBy: {
            args: Prisma.TemperatureValueGroupByArgs<ExtArgs>
            result: $Utils.Optional<TemperatureValueGroupByOutputType>[]
          }
          count: {
            args: Prisma.TemperatureValueCountArgs<ExtArgs>
            result: $Utils.Optional<TemperatureValueCountAggregateOutputType> | number
          }
        }
      }
      GoodsReceipt: {
        payload: Prisma.$GoodsReceiptPayload<ExtArgs>
        fields: Prisma.GoodsReceiptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GoodsReceiptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsReceiptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GoodsReceiptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>
          }
          findFirst: {
            args: Prisma.GoodsReceiptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsReceiptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GoodsReceiptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>
          }
          findMany: {
            args: Prisma.GoodsReceiptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>[]
          }
          create: {
            args: Prisma.GoodsReceiptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>
          }
          createMany: {
            args: Prisma.GoodsReceiptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GoodsReceiptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>[]
          }
          delete: {
            args: Prisma.GoodsReceiptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>
          }
          update: {
            args: Prisma.GoodsReceiptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>
          }
          deleteMany: {
            args: Prisma.GoodsReceiptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GoodsReceiptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GoodsReceiptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>
          }
          aggregate: {
            args: Prisma.GoodsReceiptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGoodsReceipt>
          }
          groupBy: {
            args: Prisma.GoodsReceiptGroupByArgs<ExtArgs>
            result: $Utils.Optional<GoodsReceiptGroupByOutputType>[]
          }
          count: {
            args: Prisma.GoodsReceiptCountArgs<ExtArgs>
            result: $Utils.Optional<GoodsReceiptCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ClientProfileCountOutputType
   */

  export type ClientProfileCountOutputType = {
    recipes: number
    cleaningZones: number
    cleaningLogs: number
    chambers: number
    temperatureRecords: number
    goodsReceipts: number
  }

  export type ClientProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    recipes?: boolean | ClientProfileCountOutputTypeCountRecipesArgs
    cleaningZones?: boolean | ClientProfileCountOutputTypeCountCleaningZonesArgs
    cleaningLogs?: boolean | ClientProfileCountOutputTypeCountCleaningLogsArgs
    chambers?: boolean | ClientProfileCountOutputTypeCountChambersArgs
    temperatureRecords?: boolean | ClientProfileCountOutputTypeCountTemperatureRecordsArgs
    goodsReceipts?: boolean | ClientProfileCountOutputTypeCountGoodsReceiptsArgs
  }

  // Custom InputTypes
  /**
   * ClientProfileCountOutputType without action
   */
  export type ClientProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientProfileCountOutputType
     */
    select?: ClientProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClientProfileCountOutputType without action
   */
  export type ClientProfileCountOutputTypeCountRecipesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecipeWhereInput
  }

  /**
   * ClientProfileCountOutputType without action
   */
  export type ClientProfileCountOutputTypeCountCleaningZonesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CleaningZoneWhereInput
  }

  /**
   * ClientProfileCountOutputType without action
   */
  export type ClientProfileCountOutputTypeCountCleaningLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CleaningLogWhereInput
  }

  /**
   * ClientProfileCountOutputType without action
   */
  export type ClientProfileCountOutputTypeCountChambersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChamberWhereInput
  }

  /**
   * ClientProfileCountOutputType without action
   */
  export type ClientProfileCountOutputTypeCountTemperatureRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemperatureRecordWhereInput
  }

  /**
   * ClientProfileCountOutputType without action
   */
  export type ClientProfileCountOutputTypeCountGoodsReceiptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GoodsReceiptWhereInput
  }


  /**
   * Count Type RecipeCountOutputType
   */

  export type RecipeCountOutputType = {
    ingredients: number
    elaborations: number
  }

  export type RecipeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ingredients?: boolean | RecipeCountOutputTypeCountIngredientsArgs
    elaborations?: boolean | RecipeCountOutputTypeCountElaborationsArgs
  }

  // Custom InputTypes
  /**
   * RecipeCountOutputType without action
   */
  export type RecipeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecipeCountOutputType
     */
    select?: RecipeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RecipeCountOutputType without action
   */
  export type RecipeCountOutputTypeCountIngredientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IngredientWhereInput
  }

  /**
   * RecipeCountOutputType without action
   */
  export type RecipeCountOutputTypeCountElaborationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ElaborationWhereInput
  }


  /**
   * Count Type ElaborationCountOutputType
   */

  export type ElaborationCountOutputType = {
    ingredients: number
  }

  export type ElaborationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ingredients?: boolean | ElaborationCountOutputTypeCountIngredientsArgs
  }

  // Custom InputTypes
  /**
   * ElaborationCountOutputType without action
   */
  export type ElaborationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ElaborationCountOutputType
     */
    select?: ElaborationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ElaborationCountOutputType without action
   */
  export type ElaborationCountOutputTypeCountIngredientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ElaborationIngredientWhereInput
  }


  /**
   * Count Type CleaningZoneCountOutputType
   */

  export type CleaningZoneCountOutputType = {
    logs: number
  }

  export type CleaningZoneCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    logs?: boolean | CleaningZoneCountOutputTypeCountLogsArgs
  }

  // Custom InputTypes
  /**
   * CleaningZoneCountOutputType without action
   */
  export type CleaningZoneCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningZoneCountOutputType
     */
    select?: CleaningZoneCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CleaningZoneCountOutputType without action
   */
  export type CleaningZoneCountOutputTypeCountLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CleaningLogZoneWhereInput
  }


  /**
   * Count Type CleaningLogCountOutputType
   */

  export type CleaningLogCountOutputType = {
    zones: number
  }

  export type CleaningLogCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    zones?: boolean | CleaningLogCountOutputTypeCountZonesArgs
  }

  // Custom InputTypes
  /**
   * CleaningLogCountOutputType without action
   */
  export type CleaningLogCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLogCountOutputType
     */
    select?: CleaningLogCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CleaningLogCountOutputType without action
   */
  export type CleaningLogCountOutputTypeCountZonesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CleaningLogZoneWhereInput
  }


  /**
   * Count Type ChamberCountOutputType
   */

  export type ChamberCountOutputType = {
    values: number
  }

  export type ChamberCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    values?: boolean | ChamberCountOutputTypeCountValuesArgs
  }

  // Custom InputTypes
  /**
   * ChamberCountOutputType without action
   */
  export type ChamberCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChamberCountOutputType
     */
    select?: ChamberCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChamberCountOutputType without action
   */
  export type ChamberCountOutputTypeCountValuesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemperatureValueWhereInput
  }


  /**
   * Count Type TemperatureRecordCountOutputType
   */

  export type TemperatureRecordCountOutputType = {
    values: number
  }

  export type TemperatureRecordCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    values?: boolean | TemperatureRecordCountOutputTypeCountValuesArgs
  }

  // Custom InputTypes
  /**
   * TemperatureRecordCountOutputType without action
   */
  export type TemperatureRecordCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureRecordCountOutputType
     */
    select?: TemperatureRecordCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TemperatureRecordCountOutputType without action
   */
  export type TemperatureRecordCountOutputTypeCountValuesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemperatureValueWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    name: string | null
    role: string | null
    emailVerified: boolean | null
    verificationToken: string | null
    verificationTokenExpires: Date | null
    resetPasswordToken: string | null
    resetPasswordExpires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    name: string | null
    role: string | null
    emailVerified: boolean | null
    verificationToken: string | null
    verificationTokenExpires: Date | null
    resetPasswordToken: string | null
    resetPasswordExpires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    name: number
    role: number
    emailVerified: number
    verificationToken: number
    verificationTokenExpires: number
    resetPasswordToken: number
    resetPasswordExpires: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    emailVerified?: true
    verificationToken?: true
    verificationTokenExpires?: true
    resetPasswordToken?: true
    resetPasswordExpires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    emailVerified?: true
    verificationToken?: true
    verificationTokenExpires?: true
    resetPasswordToken?: true
    resetPasswordExpires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    name?: true
    role?: true
    emailVerified?: true
    verificationToken?: true
    verificationTokenExpires?: true
    resetPasswordToken?: true
    resetPasswordExpires?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    email: string
    password: string
    name: string | null
    role: string
    emailVerified: boolean
    verificationToken: string | null
    verificationTokenExpires: Date | null
    resetPasswordToken: string | null
    resetPasswordExpires: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    emailVerified?: boolean
    verificationToken?: boolean
    verificationTokenExpires?: boolean
    resetPasswordToken?: boolean
    resetPasswordExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientProfile?: boolean | User$clientProfileArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    emailVerified?: boolean
    verificationToken?: boolean
    verificationTokenExpires?: boolean
    resetPasswordToken?: boolean
    resetPasswordExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    emailVerified?: boolean
    verificationToken?: boolean
    verificationTokenExpires?: boolean
    resetPasswordToken?: boolean
    resetPasswordExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientProfile?: boolean | User$clientProfileArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      clientProfile: Prisma.$ClientProfilePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      password: string
      name: string | null
      role: string
      emailVerified: boolean
      verificationToken: string | null
      verificationTokenExpires: Date | null
      resetPasswordToken: string | null
      resetPasswordExpires: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clientProfile<T extends User$clientProfileArgs<ExtArgs> = {}>(args?: Subset<T, User$clientProfileArgs<ExtArgs>>): Prisma__ClientProfileClient<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly verificationToken: FieldRef<"User", 'String'>
    readonly verificationTokenExpires: FieldRef<"User", 'DateTime'>
    readonly resetPasswordToken: FieldRef<"User", 'String'>
    readonly resetPasswordExpires: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.clientProfile
   */
  export type User$clientProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientProfile
     */
    select?: ClientProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientProfileInclude<ExtArgs> | null
    where?: ClientProfileWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model ClientProfile
   */

  export type AggregateClientProfile = {
    _count: ClientProfileCountAggregateOutputType | null
    _avg: ClientProfileAvgAggregateOutputType | null
    _sum: ClientProfileSumAggregateOutputType | null
    _min: ClientProfileMinAggregateOutputType | null
    _max: ClientProfileMaxAggregateOutputType | null
  }

  export type ClientProfileAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    recetasContratadas: number | null
  }

  export type ClientProfileSumAggregateOutputType = {
    id: number | null
    userId: number | null
    recetasContratadas: number | null
  }

  export type ClientProfileMinAggregateOutputType = {
    id: number | null
    userId: number | null
    razonSocial: string | null
    nif: string | null
    phone: string | null
    urlClientify: string | null
    accountType: string | null
    recetasContratadas: number | null
    canManageRecipes: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClientProfileMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    razonSocial: string | null
    nif: string | null
    phone: string | null
    urlClientify: string | null
    accountType: string | null
    recetasContratadas: number | null
    canManageRecipes: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClientProfileCountAggregateOutputType = {
    id: number
    userId: number
    razonSocial: number
    nif: number
    phone: number
    urlClientify: number
    accountType: number
    recetasContratadas: number
    canManageRecipes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClientProfileAvgAggregateInputType = {
    id?: true
    userId?: true
    recetasContratadas?: true
  }

  export type ClientProfileSumAggregateInputType = {
    id?: true
    userId?: true
    recetasContratadas?: true
  }

  export type ClientProfileMinAggregateInputType = {
    id?: true
    userId?: true
    razonSocial?: true
    nif?: true
    phone?: true
    urlClientify?: true
    accountType?: true
    recetasContratadas?: true
    canManageRecipes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClientProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    razonSocial?: true
    nif?: true
    phone?: true
    urlClientify?: true
    accountType?: true
    recetasContratadas?: true
    canManageRecipes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClientProfileCountAggregateInputType = {
    id?: true
    userId?: true
    razonSocial?: true
    nif?: true
    phone?: true
    urlClientify?: true
    accountType?: true
    recetasContratadas?: true
    canManageRecipes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClientProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClientProfile to aggregate.
     */
    where?: ClientProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientProfiles to fetch.
     */
    orderBy?: ClientProfileOrderByWithRelationInput | ClientProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClientProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClientProfiles
    **/
    _count?: true | ClientProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClientProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClientProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClientProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClientProfileMaxAggregateInputType
  }

  export type GetClientProfileAggregateType<T extends ClientProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateClientProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClientProfile[P]>
      : GetScalarType<T[P], AggregateClientProfile[P]>
  }




  export type ClientProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientProfileWhereInput
    orderBy?: ClientProfileOrderByWithAggregationInput | ClientProfileOrderByWithAggregationInput[]
    by: ClientProfileScalarFieldEnum[] | ClientProfileScalarFieldEnum
    having?: ClientProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClientProfileCountAggregateInputType | true
    _avg?: ClientProfileAvgAggregateInputType
    _sum?: ClientProfileSumAggregateInputType
    _min?: ClientProfileMinAggregateInputType
    _max?: ClientProfileMaxAggregateInputType
  }

  export type ClientProfileGroupByOutputType = {
    id: number
    userId: number
    razonSocial: string
    nif: string
    phone: string | null
    urlClientify: string | null
    accountType: string
    recetasContratadas: number
    canManageRecipes: boolean
    createdAt: Date
    updatedAt: Date
    _count: ClientProfileCountAggregateOutputType | null
    _avg: ClientProfileAvgAggregateOutputType | null
    _sum: ClientProfileSumAggregateOutputType | null
    _min: ClientProfileMinAggregateOutputType | null
    _max: ClientProfileMaxAggregateOutputType | null
  }

  type GetClientProfileGroupByPayload<T extends ClientProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClientProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClientProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClientProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ClientProfileGroupByOutputType[P]>
        }
      >
    >


  export type ClientProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    razonSocial?: boolean
    nif?: boolean
    phone?: boolean
    urlClientify?: boolean
    accountType?: boolean
    recetasContratadas?: boolean
    canManageRecipes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    recipes?: boolean | ClientProfile$recipesArgs<ExtArgs>
    cleaningZones?: boolean | ClientProfile$cleaningZonesArgs<ExtArgs>
    cleaningLogs?: boolean | ClientProfile$cleaningLogsArgs<ExtArgs>
    chambers?: boolean | ClientProfile$chambersArgs<ExtArgs>
    temperatureRecords?: boolean | ClientProfile$temperatureRecordsArgs<ExtArgs>
    goodsReceipts?: boolean | ClientProfile$goodsReceiptsArgs<ExtArgs>
    _count?: boolean | ClientProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clientProfile"]>

  export type ClientProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    razonSocial?: boolean
    nif?: boolean
    phone?: boolean
    urlClientify?: boolean
    accountType?: boolean
    recetasContratadas?: boolean
    canManageRecipes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clientProfile"]>

  export type ClientProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    razonSocial?: boolean
    nif?: boolean
    phone?: boolean
    urlClientify?: boolean
    accountType?: boolean
    recetasContratadas?: boolean
    canManageRecipes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClientProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    recipes?: boolean | ClientProfile$recipesArgs<ExtArgs>
    cleaningZones?: boolean | ClientProfile$cleaningZonesArgs<ExtArgs>
    cleaningLogs?: boolean | ClientProfile$cleaningLogsArgs<ExtArgs>
    chambers?: boolean | ClientProfile$chambersArgs<ExtArgs>
    temperatureRecords?: boolean | ClientProfile$temperatureRecordsArgs<ExtArgs>
    goodsReceipts?: boolean | ClientProfile$goodsReceiptsArgs<ExtArgs>
    _count?: boolean | ClientProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClientProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ClientProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClientProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      recipes: Prisma.$RecipePayload<ExtArgs>[]
      cleaningZones: Prisma.$CleaningZonePayload<ExtArgs>[]
      cleaningLogs: Prisma.$CleaningLogPayload<ExtArgs>[]
      chambers: Prisma.$ChamberPayload<ExtArgs>[]
      temperatureRecords: Prisma.$TemperatureRecordPayload<ExtArgs>[]
      goodsReceipts: Prisma.$GoodsReceiptPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      razonSocial: string
      nif: string
      phone: string | null
      urlClientify: string | null
      accountType: string
      recetasContratadas: number
      canManageRecipes: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["clientProfile"]>
    composites: {}
  }

  type ClientProfileGetPayload<S extends boolean | null | undefined | ClientProfileDefaultArgs> = $Result.GetResult<Prisma.$ClientProfilePayload, S>

  type ClientProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ClientProfileFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ClientProfileCountAggregateInputType | true
    }

  export interface ClientProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClientProfile'], meta: { name: 'ClientProfile' } }
    /**
     * Find zero or one ClientProfile that matches the filter.
     * @param {ClientProfileFindUniqueArgs} args - Arguments to find a ClientProfile
     * @example
     * // Get one ClientProfile
     * const clientProfile = await prisma.clientProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClientProfileFindUniqueArgs>(args: SelectSubset<T, ClientProfileFindUniqueArgs<ExtArgs>>): Prisma__ClientProfileClient<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ClientProfile that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ClientProfileFindUniqueOrThrowArgs} args - Arguments to find a ClientProfile
     * @example
     * // Get one ClientProfile
     * const clientProfile = await prisma.clientProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClientProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, ClientProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClientProfileClient<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ClientProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientProfileFindFirstArgs} args - Arguments to find a ClientProfile
     * @example
     * // Get one ClientProfile
     * const clientProfile = await prisma.clientProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClientProfileFindFirstArgs>(args?: SelectSubset<T, ClientProfileFindFirstArgs<ExtArgs>>): Prisma__ClientProfileClient<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ClientProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientProfileFindFirstOrThrowArgs} args - Arguments to find a ClientProfile
     * @example
     * // Get one ClientProfile
     * const clientProfile = await prisma.clientProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClientProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, ClientProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClientProfileClient<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ClientProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClientProfiles
     * const clientProfiles = await prisma.clientProfile.findMany()
     * 
     * // Get first 10 ClientProfiles
     * const clientProfiles = await prisma.clientProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clientProfileWithIdOnly = await prisma.clientProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClientProfileFindManyArgs>(args?: SelectSubset<T, ClientProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ClientProfile.
     * @param {ClientProfileCreateArgs} args - Arguments to create a ClientProfile.
     * @example
     * // Create one ClientProfile
     * const ClientProfile = await prisma.clientProfile.create({
     *   data: {
     *     // ... data to create a ClientProfile
     *   }
     * })
     * 
     */
    create<T extends ClientProfileCreateArgs>(args: SelectSubset<T, ClientProfileCreateArgs<ExtArgs>>): Prisma__ClientProfileClient<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ClientProfiles.
     * @param {ClientProfileCreateManyArgs} args - Arguments to create many ClientProfiles.
     * @example
     * // Create many ClientProfiles
     * const clientProfile = await prisma.clientProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClientProfileCreateManyArgs>(args?: SelectSubset<T, ClientProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClientProfiles and returns the data saved in the database.
     * @param {ClientProfileCreateManyAndReturnArgs} args - Arguments to create many ClientProfiles.
     * @example
     * // Create many ClientProfiles
     * const clientProfile = await prisma.clientProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClientProfiles and only return the `id`
     * const clientProfileWithIdOnly = await prisma.clientProfile.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClientProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, ClientProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ClientProfile.
     * @param {ClientProfileDeleteArgs} args - Arguments to delete one ClientProfile.
     * @example
     * // Delete one ClientProfile
     * const ClientProfile = await prisma.clientProfile.delete({
     *   where: {
     *     // ... filter to delete one ClientProfile
     *   }
     * })
     * 
     */
    delete<T extends ClientProfileDeleteArgs>(args: SelectSubset<T, ClientProfileDeleteArgs<ExtArgs>>): Prisma__ClientProfileClient<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ClientProfile.
     * @param {ClientProfileUpdateArgs} args - Arguments to update one ClientProfile.
     * @example
     * // Update one ClientProfile
     * const clientProfile = await prisma.clientProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClientProfileUpdateArgs>(args: SelectSubset<T, ClientProfileUpdateArgs<ExtArgs>>): Prisma__ClientProfileClient<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ClientProfiles.
     * @param {ClientProfileDeleteManyArgs} args - Arguments to filter ClientProfiles to delete.
     * @example
     * // Delete a few ClientProfiles
     * const { count } = await prisma.clientProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClientProfileDeleteManyArgs>(args?: SelectSubset<T, ClientProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClientProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClientProfiles
     * const clientProfile = await prisma.clientProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClientProfileUpdateManyArgs>(args: SelectSubset<T, ClientProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ClientProfile.
     * @param {ClientProfileUpsertArgs} args - Arguments to update or create a ClientProfile.
     * @example
     * // Update or create a ClientProfile
     * const clientProfile = await prisma.clientProfile.upsert({
     *   create: {
     *     // ... data to create a ClientProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClientProfile we want to update
     *   }
     * })
     */
    upsert<T extends ClientProfileUpsertArgs>(args: SelectSubset<T, ClientProfileUpsertArgs<ExtArgs>>): Prisma__ClientProfileClient<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ClientProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientProfileCountArgs} args - Arguments to filter ClientProfiles to count.
     * @example
     * // Count the number of ClientProfiles
     * const count = await prisma.clientProfile.count({
     *   where: {
     *     // ... the filter for the ClientProfiles we want to count
     *   }
     * })
    **/
    count<T extends ClientProfileCountArgs>(
      args?: Subset<T, ClientProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClientProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClientProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClientProfileAggregateArgs>(args: Subset<T, ClientProfileAggregateArgs>): Prisma.PrismaPromise<GetClientProfileAggregateType<T>>

    /**
     * Group by ClientProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClientProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClientProfileGroupByArgs['orderBy'] }
        : { orderBy?: ClientProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClientProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClientProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClientProfile model
   */
  readonly fields: ClientProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClientProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClientProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    recipes<T extends ClientProfile$recipesArgs<ExtArgs> = {}>(args?: Subset<T, ClientProfile$recipesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecipePayload<ExtArgs>, T, "findMany"> | Null>
    cleaningZones<T extends ClientProfile$cleaningZonesArgs<ExtArgs> = {}>(args?: Subset<T, ClientProfile$cleaningZonesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CleaningZonePayload<ExtArgs>, T, "findMany"> | Null>
    cleaningLogs<T extends ClientProfile$cleaningLogsArgs<ExtArgs> = {}>(args?: Subset<T, ClientProfile$cleaningLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CleaningLogPayload<ExtArgs>, T, "findMany"> | Null>
    chambers<T extends ClientProfile$chambersArgs<ExtArgs> = {}>(args?: Subset<T, ClientProfile$chambersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChamberPayload<ExtArgs>, T, "findMany"> | Null>
    temperatureRecords<T extends ClientProfile$temperatureRecordsArgs<ExtArgs> = {}>(args?: Subset<T, ClientProfile$temperatureRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemperatureRecordPayload<ExtArgs>, T, "findMany"> | Null>
    goodsReceipts<T extends ClientProfile$goodsReceiptsArgs<ExtArgs> = {}>(args?: Subset<T, ClientProfile$goodsReceiptsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ClientProfile model
   */ 
  interface ClientProfileFieldRefs {
    readonly id: FieldRef<"ClientProfile", 'Int'>
    readonly userId: FieldRef<"ClientProfile", 'Int'>
    readonly razonSocial: FieldRef<"ClientProfile", 'String'>
    readonly nif: FieldRef<"ClientProfile", 'String'>
    readonly phone: FieldRef<"ClientProfile", 'String'>
    readonly urlClientify: FieldRef<"ClientProfile", 'String'>
    readonly accountType: FieldRef<"ClientProfile", 'String'>
    readonly recetasContratadas: FieldRef<"ClientProfile", 'Int'>
    readonly canManageRecipes: FieldRef<"ClientProfile", 'Boolean'>
    readonly createdAt: FieldRef<"ClientProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"ClientProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClientProfile findUnique
   */
  export type ClientProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientProfile
     */
    select?: ClientProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientProfileInclude<ExtArgs> | null
    /**
     * Filter, which ClientProfile to fetch.
     */
    where: ClientProfileWhereUniqueInput
  }

  /**
   * ClientProfile findUniqueOrThrow
   */
  export type ClientProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientProfile
     */
    select?: ClientProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientProfileInclude<ExtArgs> | null
    /**
     * Filter, which ClientProfile to fetch.
     */
    where: ClientProfileWhereUniqueInput
  }

  /**
   * ClientProfile findFirst
   */
  export type ClientProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientProfile
     */
    select?: ClientProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientProfileInclude<ExtArgs> | null
    /**
     * Filter, which ClientProfile to fetch.
     */
    where?: ClientProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientProfiles to fetch.
     */
    orderBy?: ClientProfileOrderByWithRelationInput | ClientProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClientProfiles.
     */
    cursor?: ClientProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClientProfiles.
     */
    distinct?: ClientProfileScalarFieldEnum | ClientProfileScalarFieldEnum[]
  }

  /**
   * ClientProfile findFirstOrThrow
   */
  export type ClientProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientProfile
     */
    select?: ClientProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientProfileInclude<ExtArgs> | null
    /**
     * Filter, which ClientProfile to fetch.
     */
    where?: ClientProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientProfiles to fetch.
     */
    orderBy?: ClientProfileOrderByWithRelationInput | ClientProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClientProfiles.
     */
    cursor?: ClientProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClientProfiles.
     */
    distinct?: ClientProfileScalarFieldEnum | ClientProfileScalarFieldEnum[]
  }

  /**
   * ClientProfile findMany
   */
  export type ClientProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientProfile
     */
    select?: ClientProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientProfileInclude<ExtArgs> | null
    /**
     * Filter, which ClientProfiles to fetch.
     */
    where?: ClientProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientProfiles to fetch.
     */
    orderBy?: ClientProfileOrderByWithRelationInput | ClientProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClientProfiles.
     */
    cursor?: ClientProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientProfiles.
     */
    skip?: number
    distinct?: ClientProfileScalarFieldEnum | ClientProfileScalarFieldEnum[]
  }

  /**
   * ClientProfile create
   */
  export type ClientProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientProfile
     */
    select?: ClientProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a ClientProfile.
     */
    data: XOR<ClientProfileCreateInput, ClientProfileUncheckedCreateInput>
  }

  /**
   * ClientProfile createMany
   */
  export type ClientProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClientProfiles.
     */
    data: ClientProfileCreateManyInput | ClientProfileCreateManyInput[]
  }

  /**
   * ClientProfile createManyAndReturn
   */
  export type ClientProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientProfile
     */
    select?: ClientProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ClientProfiles.
     */
    data: ClientProfileCreateManyInput | ClientProfileCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClientProfile update
   */
  export type ClientProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientProfile
     */
    select?: ClientProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a ClientProfile.
     */
    data: XOR<ClientProfileUpdateInput, ClientProfileUncheckedUpdateInput>
    /**
     * Choose, which ClientProfile to update.
     */
    where: ClientProfileWhereUniqueInput
  }

  /**
   * ClientProfile updateMany
   */
  export type ClientProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClientProfiles.
     */
    data: XOR<ClientProfileUpdateManyMutationInput, ClientProfileUncheckedUpdateManyInput>
    /**
     * Filter which ClientProfiles to update
     */
    where?: ClientProfileWhereInput
  }

  /**
   * ClientProfile upsert
   */
  export type ClientProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientProfile
     */
    select?: ClientProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the ClientProfile to update in case it exists.
     */
    where: ClientProfileWhereUniqueInput
    /**
     * In case the ClientProfile found by the `where` argument doesn't exist, create a new ClientProfile with this data.
     */
    create: XOR<ClientProfileCreateInput, ClientProfileUncheckedCreateInput>
    /**
     * In case the ClientProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClientProfileUpdateInput, ClientProfileUncheckedUpdateInput>
  }

  /**
   * ClientProfile delete
   */
  export type ClientProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientProfile
     */
    select?: ClientProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientProfileInclude<ExtArgs> | null
    /**
     * Filter which ClientProfile to delete.
     */
    where: ClientProfileWhereUniqueInput
  }

  /**
   * ClientProfile deleteMany
   */
  export type ClientProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClientProfiles to delete
     */
    where?: ClientProfileWhereInput
  }

  /**
   * ClientProfile.recipes
   */
  export type ClientProfile$recipesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipe
     */
    select?: RecipeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeInclude<ExtArgs> | null
    where?: RecipeWhereInput
    orderBy?: RecipeOrderByWithRelationInput | RecipeOrderByWithRelationInput[]
    cursor?: RecipeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecipeScalarFieldEnum | RecipeScalarFieldEnum[]
  }

  /**
   * ClientProfile.cleaningZones
   */
  export type ClientProfile$cleaningZonesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningZone
     */
    select?: CleaningZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningZoneInclude<ExtArgs> | null
    where?: CleaningZoneWhereInput
    orderBy?: CleaningZoneOrderByWithRelationInput | CleaningZoneOrderByWithRelationInput[]
    cursor?: CleaningZoneWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CleaningZoneScalarFieldEnum | CleaningZoneScalarFieldEnum[]
  }

  /**
   * ClientProfile.cleaningLogs
   */
  export type ClientProfile$cleaningLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLog
     */
    select?: CleaningLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogInclude<ExtArgs> | null
    where?: CleaningLogWhereInput
    orderBy?: CleaningLogOrderByWithRelationInput | CleaningLogOrderByWithRelationInput[]
    cursor?: CleaningLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CleaningLogScalarFieldEnum | CleaningLogScalarFieldEnum[]
  }

  /**
   * ClientProfile.chambers
   */
  export type ClientProfile$chambersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chamber
     */
    select?: ChamberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamberInclude<ExtArgs> | null
    where?: ChamberWhereInput
    orderBy?: ChamberOrderByWithRelationInput | ChamberOrderByWithRelationInput[]
    cursor?: ChamberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChamberScalarFieldEnum | ChamberScalarFieldEnum[]
  }

  /**
   * ClientProfile.temperatureRecords
   */
  export type ClientProfile$temperatureRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureRecord
     */
    select?: TemperatureRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureRecordInclude<ExtArgs> | null
    where?: TemperatureRecordWhereInput
    orderBy?: TemperatureRecordOrderByWithRelationInput | TemperatureRecordOrderByWithRelationInput[]
    cursor?: TemperatureRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TemperatureRecordScalarFieldEnum | TemperatureRecordScalarFieldEnum[]
  }

  /**
   * ClientProfile.goodsReceipts
   */
  export type ClientProfile$goodsReceiptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoodsReceipt
     */
    select?: GoodsReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsReceiptInclude<ExtArgs> | null
    where?: GoodsReceiptWhereInput
    orderBy?: GoodsReceiptOrderByWithRelationInput | GoodsReceiptOrderByWithRelationInput[]
    cursor?: GoodsReceiptWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GoodsReceiptScalarFieldEnum | GoodsReceiptScalarFieldEnum[]
  }

  /**
   * ClientProfile without action
   */
  export type ClientProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientProfile
     */
    select?: ClientProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientProfileInclude<ExtArgs> | null
  }


  /**
   * Model Recipe
   */

  export type AggregateRecipe = {
    _count: RecipeCountAggregateOutputType | null
    _avg: RecipeAvgAggregateOutputType | null
    _sum: RecipeSumAggregateOutputType | null
    _min: RecipeMinAggregateOutputType | null
    _max: RecipeMaxAggregateOutputType | null
  }

  export type RecipeAvgAggregateOutputType = {
    id: number | null
    clientProfileId: number | null
  }

  export type RecipeSumAggregateOutputType = {
    id: number | null
    clientProfileId: number | null
  }

  export type RecipeMinAggregateOutputType = {
    id: number | null
    name: string | null
    clientProfileId: number | null
    lotesMandatory: boolean | null
    quantitiesMandatory: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RecipeMaxAggregateOutputType = {
    id: number | null
    name: string | null
    clientProfileId: number | null
    lotesMandatory: boolean | null
    quantitiesMandatory: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RecipeCountAggregateOutputType = {
    id: number
    name: number
    clientProfileId: number
    lotesMandatory: number
    quantitiesMandatory: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RecipeAvgAggregateInputType = {
    id?: true
    clientProfileId?: true
  }

  export type RecipeSumAggregateInputType = {
    id?: true
    clientProfileId?: true
  }

  export type RecipeMinAggregateInputType = {
    id?: true
    name?: true
    clientProfileId?: true
    lotesMandatory?: true
    quantitiesMandatory?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RecipeMaxAggregateInputType = {
    id?: true
    name?: true
    clientProfileId?: true
    lotesMandatory?: true
    quantitiesMandatory?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RecipeCountAggregateInputType = {
    id?: true
    name?: true
    clientProfileId?: true
    lotesMandatory?: true
    quantitiesMandatory?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RecipeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Recipe to aggregate.
     */
    where?: RecipeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recipes to fetch.
     */
    orderBy?: RecipeOrderByWithRelationInput | RecipeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RecipeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recipes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recipes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Recipes
    **/
    _count?: true | RecipeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RecipeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RecipeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecipeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecipeMaxAggregateInputType
  }

  export type GetRecipeAggregateType<T extends RecipeAggregateArgs> = {
        [P in keyof T & keyof AggregateRecipe]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecipe[P]>
      : GetScalarType<T[P], AggregateRecipe[P]>
  }




  export type RecipeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecipeWhereInput
    orderBy?: RecipeOrderByWithAggregationInput | RecipeOrderByWithAggregationInput[]
    by: RecipeScalarFieldEnum[] | RecipeScalarFieldEnum
    having?: RecipeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecipeCountAggregateInputType | true
    _avg?: RecipeAvgAggregateInputType
    _sum?: RecipeSumAggregateInputType
    _min?: RecipeMinAggregateInputType
    _max?: RecipeMaxAggregateInputType
  }

  export type RecipeGroupByOutputType = {
    id: number
    name: string
    clientProfileId: number
    lotesMandatory: boolean
    quantitiesMandatory: boolean
    createdAt: Date
    updatedAt: Date
    _count: RecipeCountAggregateOutputType | null
    _avg: RecipeAvgAggregateOutputType | null
    _sum: RecipeSumAggregateOutputType | null
    _min: RecipeMinAggregateOutputType | null
    _max: RecipeMaxAggregateOutputType | null
  }

  type GetRecipeGroupByPayload<T extends RecipeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RecipeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecipeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecipeGroupByOutputType[P]>
            : GetScalarType<T[P], RecipeGroupByOutputType[P]>
        }
      >
    >


  export type RecipeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    clientProfileId?: boolean
    lotesMandatory?: boolean
    quantitiesMandatory?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
    ingredients?: boolean | Recipe$ingredientsArgs<ExtArgs>
    elaborations?: boolean | Recipe$elaborationsArgs<ExtArgs>
    _count?: boolean | RecipeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recipe"]>

  export type RecipeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    clientProfileId?: boolean
    lotesMandatory?: boolean
    quantitiesMandatory?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recipe"]>

  export type RecipeSelectScalar = {
    id?: boolean
    name?: boolean
    clientProfileId?: boolean
    lotesMandatory?: boolean
    quantitiesMandatory?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RecipeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
    ingredients?: boolean | Recipe$ingredientsArgs<ExtArgs>
    elaborations?: boolean | Recipe$elaborationsArgs<ExtArgs>
    _count?: boolean | RecipeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RecipeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
  }

  export type $RecipePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Recipe"
    objects: {
      clientProfile: Prisma.$ClientProfilePayload<ExtArgs>
      ingredients: Prisma.$IngredientPayload<ExtArgs>[]
      elaborations: Prisma.$ElaborationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      clientProfileId: number
      lotesMandatory: boolean
      quantitiesMandatory: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["recipe"]>
    composites: {}
  }

  type RecipeGetPayload<S extends boolean | null | undefined | RecipeDefaultArgs> = $Result.GetResult<Prisma.$RecipePayload, S>

  type RecipeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RecipeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RecipeCountAggregateInputType | true
    }

  export interface RecipeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Recipe'], meta: { name: 'Recipe' } }
    /**
     * Find zero or one Recipe that matches the filter.
     * @param {RecipeFindUniqueArgs} args - Arguments to find a Recipe
     * @example
     * // Get one Recipe
     * const recipe = await prisma.recipe.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RecipeFindUniqueArgs>(args: SelectSubset<T, RecipeFindUniqueArgs<ExtArgs>>): Prisma__RecipeClient<$Result.GetResult<Prisma.$RecipePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Recipe that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RecipeFindUniqueOrThrowArgs} args - Arguments to find a Recipe
     * @example
     * // Get one Recipe
     * const recipe = await prisma.recipe.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RecipeFindUniqueOrThrowArgs>(args: SelectSubset<T, RecipeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RecipeClient<$Result.GetResult<Prisma.$RecipePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Recipe that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipeFindFirstArgs} args - Arguments to find a Recipe
     * @example
     * // Get one Recipe
     * const recipe = await prisma.recipe.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RecipeFindFirstArgs>(args?: SelectSubset<T, RecipeFindFirstArgs<ExtArgs>>): Prisma__RecipeClient<$Result.GetResult<Prisma.$RecipePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Recipe that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipeFindFirstOrThrowArgs} args - Arguments to find a Recipe
     * @example
     * // Get one Recipe
     * const recipe = await prisma.recipe.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RecipeFindFirstOrThrowArgs>(args?: SelectSubset<T, RecipeFindFirstOrThrowArgs<ExtArgs>>): Prisma__RecipeClient<$Result.GetResult<Prisma.$RecipePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Recipes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Recipes
     * const recipes = await prisma.recipe.findMany()
     * 
     * // Get first 10 Recipes
     * const recipes = await prisma.recipe.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const recipeWithIdOnly = await prisma.recipe.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RecipeFindManyArgs>(args?: SelectSubset<T, RecipeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecipePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Recipe.
     * @param {RecipeCreateArgs} args - Arguments to create a Recipe.
     * @example
     * // Create one Recipe
     * const Recipe = await prisma.recipe.create({
     *   data: {
     *     // ... data to create a Recipe
     *   }
     * })
     * 
     */
    create<T extends RecipeCreateArgs>(args: SelectSubset<T, RecipeCreateArgs<ExtArgs>>): Prisma__RecipeClient<$Result.GetResult<Prisma.$RecipePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Recipes.
     * @param {RecipeCreateManyArgs} args - Arguments to create many Recipes.
     * @example
     * // Create many Recipes
     * const recipe = await prisma.recipe.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RecipeCreateManyArgs>(args?: SelectSubset<T, RecipeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Recipes and returns the data saved in the database.
     * @param {RecipeCreateManyAndReturnArgs} args - Arguments to create many Recipes.
     * @example
     * // Create many Recipes
     * const recipe = await prisma.recipe.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Recipes and only return the `id`
     * const recipeWithIdOnly = await prisma.recipe.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RecipeCreateManyAndReturnArgs>(args?: SelectSubset<T, RecipeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecipePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Recipe.
     * @param {RecipeDeleteArgs} args - Arguments to delete one Recipe.
     * @example
     * // Delete one Recipe
     * const Recipe = await prisma.recipe.delete({
     *   where: {
     *     // ... filter to delete one Recipe
     *   }
     * })
     * 
     */
    delete<T extends RecipeDeleteArgs>(args: SelectSubset<T, RecipeDeleteArgs<ExtArgs>>): Prisma__RecipeClient<$Result.GetResult<Prisma.$RecipePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Recipe.
     * @param {RecipeUpdateArgs} args - Arguments to update one Recipe.
     * @example
     * // Update one Recipe
     * const recipe = await prisma.recipe.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RecipeUpdateArgs>(args: SelectSubset<T, RecipeUpdateArgs<ExtArgs>>): Prisma__RecipeClient<$Result.GetResult<Prisma.$RecipePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Recipes.
     * @param {RecipeDeleteManyArgs} args - Arguments to filter Recipes to delete.
     * @example
     * // Delete a few Recipes
     * const { count } = await prisma.recipe.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RecipeDeleteManyArgs>(args?: SelectSubset<T, RecipeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Recipes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Recipes
     * const recipe = await prisma.recipe.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RecipeUpdateManyArgs>(args: SelectSubset<T, RecipeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Recipe.
     * @param {RecipeUpsertArgs} args - Arguments to update or create a Recipe.
     * @example
     * // Update or create a Recipe
     * const recipe = await prisma.recipe.upsert({
     *   create: {
     *     // ... data to create a Recipe
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Recipe we want to update
     *   }
     * })
     */
    upsert<T extends RecipeUpsertArgs>(args: SelectSubset<T, RecipeUpsertArgs<ExtArgs>>): Prisma__RecipeClient<$Result.GetResult<Prisma.$RecipePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Recipes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipeCountArgs} args - Arguments to filter Recipes to count.
     * @example
     * // Count the number of Recipes
     * const count = await prisma.recipe.count({
     *   where: {
     *     // ... the filter for the Recipes we want to count
     *   }
     * })
    **/
    count<T extends RecipeCountArgs>(
      args?: Subset<T, RecipeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecipeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Recipe.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RecipeAggregateArgs>(args: Subset<T, RecipeAggregateArgs>): Prisma.PrismaPromise<GetRecipeAggregateType<T>>

    /**
     * Group by Recipe.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecipeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RecipeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RecipeGroupByArgs['orderBy'] }
        : { orderBy?: RecipeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RecipeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecipeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Recipe model
   */
  readonly fields: RecipeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Recipe.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RecipeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clientProfile<T extends ClientProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientProfileDefaultArgs<ExtArgs>>): Prisma__ClientProfileClient<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    ingredients<T extends Recipe$ingredientsArgs<ExtArgs> = {}>(args?: Subset<T, Recipe$ingredientsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findMany"> | Null>
    elaborations<T extends Recipe$elaborationsArgs<ExtArgs> = {}>(args?: Subset<T, Recipe$elaborationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ElaborationPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Recipe model
   */ 
  interface RecipeFieldRefs {
    readonly id: FieldRef<"Recipe", 'Int'>
    readonly name: FieldRef<"Recipe", 'String'>
    readonly clientProfileId: FieldRef<"Recipe", 'Int'>
    readonly lotesMandatory: FieldRef<"Recipe", 'Boolean'>
    readonly quantitiesMandatory: FieldRef<"Recipe", 'Boolean'>
    readonly createdAt: FieldRef<"Recipe", 'DateTime'>
    readonly updatedAt: FieldRef<"Recipe", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Recipe findUnique
   */
  export type RecipeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipe
     */
    select?: RecipeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeInclude<ExtArgs> | null
    /**
     * Filter, which Recipe to fetch.
     */
    where: RecipeWhereUniqueInput
  }

  /**
   * Recipe findUniqueOrThrow
   */
  export type RecipeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipe
     */
    select?: RecipeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeInclude<ExtArgs> | null
    /**
     * Filter, which Recipe to fetch.
     */
    where: RecipeWhereUniqueInput
  }

  /**
   * Recipe findFirst
   */
  export type RecipeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipe
     */
    select?: RecipeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeInclude<ExtArgs> | null
    /**
     * Filter, which Recipe to fetch.
     */
    where?: RecipeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recipes to fetch.
     */
    orderBy?: RecipeOrderByWithRelationInput | RecipeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Recipes.
     */
    cursor?: RecipeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recipes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recipes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recipes.
     */
    distinct?: RecipeScalarFieldEnum | RecipeScalarFieldEnum[]
  }

  /**
   * Recipe findFirstOrThrow
   */
  export type RecipeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipe
     */
    select?: RecipeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeInclude<ExtArgs> | null
    /**
     * Filter, which Recipe to fetch.
     */
    where?: RecipeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recipes to fetch.
     */
    orderBy?: RecipeOrderByWithRelationInput | RecipeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Recipes.
     */
    cursor?: RecipeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recipes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recipes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recipes.
     */
    distinct?: RecipeScalarFieldEnum | RecipeScalarFieldEnum[]
  }

  /**
   * Recipe findMany
   */
  export type RecipeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipe
     */
    select?: RecipeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeInclude<ExtArgs> | null
    /**
     * Filter, which Recipes to fetch.
     */
    where?: RecipeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recipes to fetch.
     */
    orderBy?: RecipeOrderByWithRelationInput | RecipeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Recipes.
     */
    cursor?: RecipeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recipes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recipes.
     */
    skip?: number
    distinct?: RecipeScalarFieldEnum | RecipeScalarFieldEnum[]
  }

  /**
   * Recipe create
   */
  export type RecipeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipe
     */
    select?: RecipeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeInclude<ExtArgs> | null
    /**
     * The data needed to create a Recipe.
     */
    data: XOR<RecipeCreateInput, RecipeUncheckedCreateInput>
  }

  /**
   * Recipe createMany
   */
  export type RecipeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Recipes.
     */
    data: RecipeCreateManyInput | RecipeCreateManyInput[]
  }

  /**
   * Recipe createManyAndReturn
   */
  export type RecipeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipe
     */
    select?: RecipeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Recipes.
     */
    data: RecipeCreateManyInput | RecipeCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Recipe update
   */
  export type RecipeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipe
     */
    select?: RecipeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeInclude<ExtArgs> | null
    /**
     * The data needed to update a Recipe.
     */
    data: XOR<RecipeUpdateInput, RecipeUncheckedUpdateInput>
    /**
     * Choose, which Recipe to update.
     */
    where: RecipeWhereUniqueInput
  }

  /**
   * Recipe updateMany
   */
  export type RecipeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Recipes.
     */
    data: XOR<RecipeUpdateManyMutationInput, RecipeUncheckedUpdateManyInput>
    /**
     * Filter which Recipes to update
     */
    where?: RecipeWhereInput
  }

  /**
   * Recipe upsert
   */
  export type RecipeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipe
     */
    select?: RecipeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeInclude<ExtArgs> | null
    /**
     * The filter to search for the Recipe to update in case it exists.
     */
    where: RecipeWhereUniqueInput
    /**
     * In case the Recipe found by the `where` argument doesn't exist, create a new Recipe with this data.
     */
    create: XOR<RecipeCreateInput, RecipeUncheckedCreateInput>
    /**
     * In case the Recipe was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RecipeUpdateInput, RecipeUncheckedUpdateInput>
  }

  /**
   * Recipe delete
   */
  export type RecipeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipe
     */
    select?: RecipeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeInclude<ExtArgs> | null
    /**
     * Filter which Recipe to delete.
     */
    where: RecipeWhereUniqueInput
  }

  /**
   * Recipe deleteMany
   */
  export type RecipeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Recipes to delete
     */
    where?: RecipeWhereInput
  }

  /**
   * Recipe.ingredients
   */
  export type Recipe$ingredientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngredientInclude<ExtArgs> | null
    where?: IngredientWhereInput
    orderBy?: IngredientOrderByWithRelationInput | IngredientOrderByWithRelationInput[]
    cursor?: IngredientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IngredientScalarFieldEnum | IngredientScalarFieldEnum[]
  }

  /**
   * Recipe.elaborations
   */
  export type Recipe$elaborationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Elaboration
     */
    select?: ElaborationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationInclude<ExtArgs> | null
    where?: ElaborationWhereInput
    orderBy?: ElaborationOrderByWithRelationInput | ElaborationOrderByWithRelationInput[]
    cursor?: ElaborationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ElaborationScalarFieldEnum | ElaborationScalarFieldEnum[]
  }

  /**
   * Recipe without action
   */
  export type RecipeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recipe
     */
    select?: RecipeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecipeInclude<ExtArgs> | null
  }


  /**
   * Model Ingredient
   */

  export type AggregateIngredient = {
    _count: IngredientCountAggregateOutputType | null
    _avg: IngredientAvgAggregateOutputType | null
    _sum: IngredientSumAggregateOutputType | null
    _min: IngredientMinAggregateOutputType | null
    _max: IngredientMaxAggregateOutputType | null
  }

  export type IngredientAvgAggregateOutputType = {
    id: number | null
    recipeId: number | null
  }

  export type IngredientSumAggregateOutputType = {
    id: number | null
    recipeId: number | null
  }

  export type IngredientMinAggregateOutputType = {
    id: number | null
    recipeId: number | null
    name: string | null
    amount: string | null
    unit: string | null
    loteMandatory: boolean | null
    quantityMandatory: boolean | null
    createdAt: Date | null
  }

  export type IngredientMaxAggregateOutputType = {
    id: number | null
    recipeId: number | null
    name: string | null
    amount: string | null
    unit: string | null
    loteMandatory: boolean | null
    quantityMandatory: boolean | null
    createdAt: Date | null
  }

  export type IngredientCountAggregateOutputType = {
    id: number
    recipeId: number
    name: number
    amount: number
    unit: number
    loteMandatory: number
    quantityMandatory: number
    createdAt: number
    _all: number
  }


  export type IngredientAvgAggregateInputType = {
    id?: true
    recipeId?: true
  }

  export type IngredientSumAggregateInputType = {
    id?: true
    recipeId?: true
  }

  export type IngredientMinAggregateInputType = {
    id?: true
    recipeId?: true
    name?: true
    amount?: true
    unit?: true
    loteMandatory?: true
    quantityMandatory?: true
    createdAt?: true
  }

  export type IngredientMaxAggregateInputType = {
    id?: true
    recipeId?: true
    name?: true
    amount?: true
    unit?: true
    loteMandatory?: true
    quantityMandatory?: true
    createdAt?: true
  }

  export type IngredientCountAggregateInputType = {
    id?: true
    recipeId?: true
    name?: true
    amount?: true
    unit?: true
    loteMandatory?: true
    quantityMandatory?: true
    createdAt?: true
    _all?: true
  }

  export type IngredientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ingredient to aggregate.
     */
    where?: IngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ingredients to fetch.
     */
    orderBy?: IngredientOrderByWithRelationInput | IngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ingredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ingredients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ingredients
    **/
    _count?: true | IngredientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IngredientAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IngredientSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IngredientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IngredientMaxAggregateInputType
  }

  export type GetIngredientAggregateType<T extends IngredientAggregateArgs> = {
        [P in keyof T & keyof AggregateIngredient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIngredient[P]>
      : GetScalarType<T[P], AggregateIngredient[P]>
  }




  export type IngredientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IngredientWhereInput
    orderBy?: IngredientOrderByWithAggregationInput | IngredientOrderByWithAggregationInput[]
    by: IngredientScalarFieldEnum[] | IngredientScalarFieldEnum
    having?: IngredientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IngredientCountAggregateInputType | true
    _avg?: IngredientAvgAggregateInputType
    _sum?: IngredientSumAggregateInputType
    _min?: IngredientMinAggregateInputType
    _max?: IngredientMaxAggregateInputType
  }

  export type IngredientGroupByOutputType = {
    id: number
    recipeId: number
    name: string
    amount: string
    unit: string
    loteMandatory: boolean
    quantityMandatory: boolean
    createdAt: Date
    _count: IngredientCountAggregateOutputType | null
    _avg: IngredientAvgAggregateOutputType | null
    _sum: IngredientSumAggregateOutputType | null
    _min: IngredientMinAggregateOutputType | null
    _max: IngredientMaxAggregateOutputType | null
  }

  type GetIngredientGroupByPayload<T extends IngredientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IngredientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IngredientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IngredientGroupByOutputType[P]>
            : GetScalarType<T[P], IngredientGroupByOutputType[P]>
        }
      >
    >


  export type IngredientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recipeId?: boolean
    name?: boolean
    amount?: boolean
    unit?: boolean
    loteMandatory?: boolean
    quantityMandatory?: boolean
    createdAt?: boolean
    recipe?: boolean | RecipeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ingredient"]>

  export type IngredientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recipeId?: boolean
    name?: boolean
    amount?: boolean
    unit?: boolean
    loteMandatory?: boolean
    quantityMandatory?: boolean
    createdAt?: boolean
    recipe?: boolean | RecipeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ingredient"]>

  export type IngredientSelectScalar = {
    id?: boolean
    recipeId?: boolean
    name?: boolean
    amount?: boolean
    unit?: boolean
    loteMandatory?: boolean
    quantityMandatory?: boolean
    createdAt?: boolean
  }

  export type IngredientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    recipe?: boolean | RecipeDefaultArgs<ExtArgs>
  }
  export type IngredientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    recipe?: boolean | RecipeDefaultArgs<ExtArgs>
  }

  export type $IngredientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ingredient"
    objects: {
      recipe: Prisma.$RecipePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      recipeId: number
      name: string
      amount: string
      unit: string
      loteMandatory: boolean
      quantityMandatory: boolean
      createdAt: Date
    }, ExtArgs["result"]["ingredient"]>
    composites: {}
  }

  type IngredientGetPayload<S extends boolean | null | undefined | IngredientDefaultArgs> = $Result.GetResult<Prisma.$IngredientPayload, S>

  type IngredientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<IngredientFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: IngredientCountAggregateInputType | true
    }

  export interface IngredientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ingredient'], meta: { name: 'Ingredient' } }
    /**
     * Find zero or one Ingredient that matches the filter.
     * @param {IngredientFindUniqueArgs} args - Arguments to find a Ingredient
     * @example
     * // Get one Ingredient
     * const ingredient = await prisma.ingredient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IngredientFindUniqueArgs>(args: SelectSubset<T, IngredientFindUniqueArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Ingredient that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {IngredientFindUniqueOrThrowArgs} args - Arguments to find a Ingredient
     * @example
     * // Get one Ingredient
     * const ingredient = await prisma.ingredient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IngredientFindUniqueOrThrowArgs>(args: SelectSubset<T, IngredientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Ingredient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientFindFirstArgs} args - Arguments to find a Ingredient
     * @example
     * // Get one Ingredient
     * const ingredient = await prisma.ingredient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IngredientFindFirstArgs>(args?: SelectSubset<T, IngredientFindFirstArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Ingredient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientFindFirstOrThrowArgs} args - Arguments to find a Ingredient
     * @example
     * // Get one Ingredient
     * const ingredient = await prisma.ingredient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IngredientFindFirstOrThrowArgs>(args?: SelectSubset<T, IngredientFindFirstOrThrowArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Ingredients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ingredients
     * const ingredients = await prisma.ingredient.findMany()
     * 
     * // Get first 10 Ingredients
     * const ingredients = await prisma.ingredient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ingredientWithIdOnly = await prisma.ingredient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IngredientFindManyArgs>(args?: SelectSubset<T, IngredientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Ingredient.
     * @param {IngredientCreateArgs} args - Arguments to create a Ingredient.
     * @example
     * // Create one Ingredient
     * const Ingredient = await prisma.ingredient.create({
     *   data: {
     *     // ... data to create a Ingredient
     *   }
     * })
     * 
     */
    create<T extends IngredientCreateArgs>(args: SelectSubset<T, IngredientCreateArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Ingredients.
     * @param {IngredientCreateManyArgs} args - Arguments to create many Ingredients.
     * @example
     * // Create many Ingredients
     * const ingredient = await prisma.ingredient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IngredientCreateManyArgs>(args?: SelectSubset<T, IngredientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ingredients and returns the data saved in the database.
     * @param {IngredientCreateManyAndReturnArgs} args - Arguments to create many Ingredients.
     * @example
     * // Create many Ingredients
     * const ingredient = await prisma.ingredient.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ingredients and only return the `id`
     * const ingredientWithIdOnly = await prisma.ingredient.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IngredientCreateManyAndReturnArgs>(args?: SelectSubset<T, IngredientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Ingredient.
     * @param {IngredientDeleteArgs} args - Arguments to delete one Ingredient.
     * @example
     * // Delete one Ingredient
     * const Ingredient = await prisma.ingredient.delete({
     *   where: {
     *     // ... filter to delete one Ingredient
     *   }
     * })
     * 
     */
    delete<T extends IngredientDeleteArgs>(args: SelectSubset<T, IngredientDeleteArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Ingredient.
     * @param {IngredientUpdateArgs} args - Arguments to update one Ingredient.
     * @example
     * // Update one Ingredient
     * const ingredient = await prisma.ingredient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IngredientUpdateArgs>(args: SelectSubset<T, IngredientUpdateArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Ingredients.
     * @param {IngredientDeleteManyArgs} args - Arguments to filter Ingredients to delete.
     * @example
     * // Delete a few Ingredients
     * const { count } = await prisma.ingredient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IngredientDeleteManyArgs>(args?: SelectSubset<T, IngredientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ingredients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ingredients
     * const ingredient = await prisma.ingredient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IngredientUpdateManyArgs>(args: SelectSubset<T, IngredientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Ingredient.
     * @param {IngredientUpsertArgs} args - Arguments to update or create a Ingredient.
     * @example
     * // Update or create a Ingredient
     * const ingredient = await prisma.ingredient.upsert({
     *   create: {
     *     // ... data to create a Ingredient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ingredient we want to update
     *   }
     * })
     */
    upsert<T extends IngredientUpsertArgs>(args: SelectSubset<T, IngredientUpsertArgs<ExtArgs>>): Prisma__IngredientClient<$Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Ingredients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientCountArgs} args - Arguments to filter Ingredients to count.
     * @example
     * // Count the number of Ingredients
     * const count = await prisma.ingredient.count({
     *   where: {
     *     // ... the filter for the Ingredients we want to count
     *   }
     * })
    **/
    count<T extends IngredientCountArgs>(
      args?: Subset<T, IngredientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IngredientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ingredient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IngredientAggregateArgs>(args: Subset<T, IngredientAggregateArgs>): Prisma.PrismaPromise<GetIngredientAggregateType<T>>

    /**
     * Group by Ingredient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IngredientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IngredientGroupByArgs['orderBy'] }
        : { orderBy?: IngredientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IngredientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIngredientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ingredient model
   */
  readonly fields: IngredientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ingredient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IngredientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    recipe<T extends RecipeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RecipeDefaultArgs<ExtArgs>>): Prisma__RecipeClient<$Result.GetResult<Prisma.$RecipePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Ingredient model
   */ 
  interface IngredientFieldRefs {
    readonly id: FieldRef<"Ingredient", 'Int'>
    readonly recipeId: FieldRef<"Ingredient", 'Int'>
    readonly name: FieldRef<"Ingredient", 'String'>
    readonly amount: FieldRef<"Ingredient", 'String'>
    readonly unit: FieldRef<"Ingredient", 'String'>
    readonly loteMandatory: FieldRef<"Ingredient", 'Boolean'>
    readonly quantityMandatory: FieldRef<"Ingredient", 'Boolean'>
    readonly createdAt: FieldRef<"Ingredient", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ingredient findUnique
   */
  export type IngredientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngredientInclude<ExtArgs> | null
    /**
     * Filter, which Ingredient to fetch.
     */
    where: IngredientWhereUniqueInput
  }

  /**
   * Ingredient findUniqueOrThrow
   */
  export type IngredientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngredientInclude<ExtArgs> | null
    /**
     * Filter, which Ingredient to fetch.
     */
    where: IngredientWhereUniqueInput
  }

  /**
   * Ingredient findFirst
   */
  export type IngredientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngredientInclude<ExtArgs> | null
    /**
     * Filter, which Ingredient to fetch.
     */
    where?: IngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ingredients to fetch.
     */
    orderBy?: IngredientOrderByWithRelationInput | IngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ingredients.
     */
    cursor?: IngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ingredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ingredients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ingredients.
     */
    distinct?: IngredientScalarFieldEnum | IngredientScalarFieldEnum[]
  }

  /**
   * Ingredient findFirstOrThrow
   */
  export type IngredientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngredientInclude<ExtArgs> | null
    /**
     * Filter, which Ingredient to fetch.
     */
    where?: IngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ingredients to fetch.
     */
    orderBy?: IngredientOrderByWithRelationInput | IngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ingredients.
     */
    cursor?: IngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ingredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ingredients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ingredients.
     */
    distinct?: IngredientScalarFieldEnum | IngredientScalarFieldEnum[]
  }

  /**
   * Ingredient findMany
   */
  export type IngredientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngredientInclude<ExtArgs> | null
    /**
     * Filter, which Ingredients to fetch.
     */
    where?: IngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ingredients to fetch.
     */
    orderBy?: IngredientOrderByWithRelationInput | IngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ingredients.
     */
    cursor?: IngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ingredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ingredients.
     */
    skip?: number
    distinct?: IngredientScalarFieldEnum | IngredientScalarFieldEnum[]
  }

  /**
   * Ingredient create
   */
  export type IngredientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngredientInclude<ExtArgs> | null
    /**
     * The data needed to create a Ingredient.
     */
    data: XOR<IngredientCreateInput, IngredientUncheckedCreateInput>
  }

  /**
   * Ingredient createMany
   */
  export type IngredientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ingredients.
     */
    data: IngredientCreateManyInput | IngredientCreateManyInput[]
  }

  /**
   * Ingredient createManyAndReturn
   */
  export type IngredientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Ingredients.
     */
    data: IngredientCreateManyInput | IngredientCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngredientIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ingredient update
   */
  export type IngredientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngredientInclude<ExtArgs> | null
    /**
     * The data needed to update a Ingredient.
     */
    data: XOR<IngredientUpdateInput, IngredientUncheckedUpdateInput>
    /**
     * Choose, which Ingredient to update.
     */
    where: IngredientWhereUniqueInput
  }

  /**
   * Ingredient updateMany
   */
  export type IngredientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ingredients.
     */
    data: XOR<IngredientUpdateManyMutationInput, IngredientUncheckedUpdateManyInput>
    /**
     * Filter which Ingredients to update
     */
    where?: IngredientWhereInput
  }

  /**
   * Ingredient upsert
   */
  export type IngredientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngredientInclude<ExtArgs> | null
    /**
     * The filter to search for the Ingredient to update in case it exists.
     */
    where: IngredientWhereUniqueInput
    /**
     * In case the Ingredient found by the `where` argument doesn't exist, create a new Ingredient with this data.
     */
    create: XOR<IngredientCreateInput, IngredientUncheckedCreateInput>
    /**
     * In case the Ingredient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IngredientUpdateInput, IngredientUncheckedUpdateInput>
  }

  /**
   * Ingredient delete
   */
  export type IngredientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngredientInclude<ExtArgs> | null
    /**
     * Filter which Ingredient to delete.
     */
    where: IngredientWhereUniqueInput
  }

  /**
   * Ingredient deleteMany
   */
  export type IngredientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ingredients to delete
     */
    where?: IngredientWhereInput
  }

  /**
   * Ingredient without action
   */
  export type IngredientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: IngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngredientInclude<ExtArgs> | null
  }


  /**
   * Model Elaboration
   */

  export type AggregateElaboration = {
    _count: ElaborationCountAggregateOutputType | null
    _avg: ElaborationAvgAggregateOutputType | null
    _sum: ElaborationSumAggregateOutputType | null
    _min: ElaborationMinAggregateOutputType | null
    _max: ElaborationMaxAggregateOutputType | null
  }

  export type ElaborationAvgAggregateOutputType = {
    id: number | null
    recipeId: number | null
  }

  export type ElaborationSumAggregateOutputType = {
    id: number | null
    recipeId: number | null
  }

  export type ElaborationMinAggregateOutputType = {
    id: number | null
    name: string | null
    date: Date | null
    recipeId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ElaborationMaxAggregateOutputType = {
    id: number | null
    name: string | null
    date: Date | null
    recipeId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ElaborationCountAggregateOutputType = {
    id: number
    name: number
    date: number
    recipeId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ElaborationAvgAggregateInputType = {
    id?: true
    recipeId?: true
  }

  export type ElaborationSumAggregateInputType = {
    id?: true
    recipeId?: true
  }

  export type ElaborationMinAggregateInputType = {
    id?: true
    name?: true
    date?: true
    recipeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ElaborationMaxAggregateInputType = {
    id?: true
    name?: true
    date?: true
    recipeId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ElaborationCountAggregateInputType = {
    id?: true
    name?: true
    date?: true
    recipeId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ElaborationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Elaboration to aggregate.
     */
    where?: ElaborationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Elaborations to fetch.
     */
    orderBy?: ElaborationOrderByWithRelationInput | ElaborationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ElaborationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Elaborations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Elaborations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Elaborations
    **/
    _count?: true | ElaborationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ElaborationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ElaborationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ElaborationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ElaborationMaxAggregateInputType
  }

  export type GetElaborationAggregateType<T extends ElaborationAggregateArgs> = {
        [P in keyof T & keyof AggregateElaboration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateElaboration[P]>
      : GetScalarType<T[P], AggregateElaboration[P]>
  }




  export type ElaborationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ElaborationWhereInput
    orderBy?: ElaborationOrderByWithAggregationInput | ElaborationOrderByWithAggregationInput[]
    by: ElaborationScalarFieldEnum[] | ElaborationScalarFieldEnum
    having?: ElaborationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ElaborationCountAggregateInputType | true
    _avg?: ElaborationAvgAggregateInputType
    _sum?: ElaborationSumAggregateInputType
    _min?: ElaborationMinAggregateInputType
    _max?: ElaborationMaxAggregateInputType
  }

  export type ElaborationGroupByOutputType = {
    id: number
    name: string
    date: Date
    recipeId: number
    createdAt: Date
    updatedAt: Date
    _count: ElaborationCountAggregateOutputType | null
    _avg: ElaborationAvgAggregateOutputType | null
    _sum: ElaborationSumAggregateOutputType | null
    _min: ElaborationMinAggregateOutputType | null
    _max: ElaborationMaxAggregateOutputType | null
  }

  type GetElaborationGroupByPayload<T extends ElaborationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ElaborationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ElaborationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ElaborationGroupByOutputType[P]>
            : GetScalarType<T[P], ElaborationGroupByOutputType[P]>
        }
      >
    >


  export type ElaborationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    date?: boolean
    recipeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    recipe?: boolean | RecipeDefaultArgs<ExtArgs>
    ingredients?: boolean | Elaboration$ingredientsArgs<ExtArgs>
    _count?: boolean | ElaborationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["elaboration"]>

  export type ElaborationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    date?: boolean
    recipeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    recipe?: boolean | RecipeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["elaboration"]>

  export type ElaborationSelectScalar = {
    id?: boolean
    name?: boolean
    date?: boolean
    recipeId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ElaborationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    recipe?: boolean | RecipeDefaultArgs<ExtArgs>
    ingredients?: boolean | Elaboration$ingredientsArgs<ExtArgs>
    _count?: boolean | ElaborationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ElaborationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    recipe?: boolean | RecipeDefaultArgs<ExtArgs>
  }

  export type $ElaborationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Elaboration"
    objects: {
      recipe: Prisma.$RecipePayload<ExtArgs>
      ingredients: Prisma.$ElaborationIngredientPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      date: Date
      recipeId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["elaboration"]>
    composites: {}
  }

  type ElaborationGetPayload<S extends boolean | null | undefined | ElaborationDefaultArgs> = $Result.GetResult<Prisma.$ElaborationPayload, S>

  type ElaborationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ElaborationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ElaborationCountAggregateInputType | true
    }

  export interface ElaborationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Elaboration'], meta: { name: 'Elaboration' } }
    /**
     * Find zero or one Elaboration that matches the filter.
     * @param {ElaborationFindUniqueArgs} args - Arguments to find a Elaboration
     * @example
     * // Get one Elaboration
     * const elaboration = await prisma.elaboration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ElaborationFindUniqueArgs>(args: SelectSubset<T, ElaborationFindUniqueArgs<ExtArgs>>): Prisma__ElaborationClient<$Result.GetResult<Prisma.$ElaborationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Elaboration that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ElaborationFindUniqueOrThrowArgs} args - Arguments to find a Elaboration
     * @example
     * // Get one Elaboration
     * const elaboration = await prisma.elaboration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ElaborationFindUniqueOrThrowArgs>(args: SelectSubset<T, ElaborationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ElaborationClient<$Result.GetResult<Prisma.$ElaborationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Elaboration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ElaborationFindFirstArgs} args - Arguments to find a Elaboration
     * @example
     * // Get one Elaboration
     * const elaboration = await prisma.elaboration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ElaborationFindFirstArgs>(args?: SelectSubset<T, ElaborationFindFirstArgs<ExtArgs>>): Prisma__ElaborationClient<$Result.GetResult<Prisma.$ElaborationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Elaboration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ElaborationFindFirstOrThrowArgs} args - Arguments to find a Elaboration
     * @example
     * // Get one Elaboration
     * const elaboration = await prisma.elaboration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ElaborationFindFirstOrThrowArgs>(args?: SelectSubset<T, ElaborationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ElaborationClient<$Result.GetResult<Prisma.$ElaborationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Elaborations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ElaborationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Elaborations
     * const elaborations = await prisma.elaboration.findMany()
     * 
     * // Get first 10 Elaborations
     * const elaborations = await prisma.elaboration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const elaborationWithIdOnly = await prisma.elaboration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ElaborationFindManyArgs>(args?: SelectSubset<T, ElaborationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ElaborationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Elaboration.
     * @param {ElaborationCreateArgs} args - Arguments to create a Elaboration.
     * @example
     * // Create one Elaboration
     * const Elaboration = await prisma.elaboration.create({
     *   data: {
     *     // ... data to create a Elaboration
     *   }
     * })
     * 
     */
    create<T extends ElaborationCreateArgs>(args: SelectSubset<T, ElaborationCreateArgs<ExtArgs>>): Prisma__ElaborationClient<$Result.GetResult<Prisma.$ElaborationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Elaborations.
     * @param {ElaborationCreateManyArgs} args - Arguments to create many Elaborations.
     * @example
     * // Create many Elaborations
     * const elaboration = await prisma.elaboration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ElaborationCreateManyArgs>(args?: SelectSubset<T, ElaborationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Elaborations and returns the data saved in the database.
     * @param {ElaborationCreateManyAndReturnArgs} args - Arguments to create many Elaborations.
     * @example
     * // Create many Elaborations
     * const elaboration = await prisma.elaboration.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Elaborations and only return the `id`
     * const elaborationWithIdOnly = await prisma.elaboration.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ElaborationCreateManyAndReturnArgs>(args?: SelectSubset<T, ElaborationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ElaborationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Elaboration.
     * @param {ElaborationDeleteArgs} args - Arguments to delete one Elaboration.
     * @example
     * // Delete one Elaboration
     * const Elaboration = await prisma.elaboration.delete({
     *   where: {
     *     // ... filter to delete one Elaboration
     *   }
     * })
     * 
     */
    delete<T extends ElaborationDeleteArgs>(args: SelectSubset<T, ElaborationDeleteArgs<ExtArgs>>): Prisma__ElaborationClient<$Result.GetResult<Prisma.$ElaborationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Elaboration.
     * @param {ElaborationUpdateArgs} args - Arguments to update one Elaboration.
     * @example
     * // Update one Elaboration
     * const elaboration = await prisma.elaboration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ElaborationUpdateArgs>(args: SelectSubset<T, ElaborationUpdateArgs<ExtArgs>>): Prisma__ElaborationClient<$Result.GetResult<Prisma.$ElaborationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Elaborations.
     * @param {ElaborationDeleteManyArgs} args - Arguments to filter Elaborations to delete.
     * @example
     * // Delete a few Elaborations
     * const { count } = await prisma.elaboration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ElaborationDeleteManyArgs>(args?: SelectSubset<T, ElaborationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Elaborations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ElaborationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Elaborations
     * const elaboration = await prisma.elaboration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ElaborationUpdateManyArgs>(args: SelectSubset<T, ElaborationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Elaboration.
     * @param {ElaborationUpsertArgs} args - Arguments to update or create a Elaboration.
     * @example
     * // Update or create a Elaboration
     * const elaboration = await prisma.elaboration.upsert({
     *   create: {
     *     // ... data to create a Elaboration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Elaboration we want to update
     *   }
     * })
     */
    upsert<T extends ElaborationUpsertArgs>(args: SelectSubset<T, ElaborationUpsertArgs<ExtArgs>>): Prisma__ElaborationClient<$Result.GetResult<Prisma.$ElaborationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Elaborations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ElaborationCountArgs} args - Arguments to filter Elaborations to count.
     * @example
     * // Count the number of Elaborations
     * const count = await prisma.elaboration.count({
     *   where: {
     *     // ... the filter for the Elaborations we want to count
     *   }
     * })
    **/
    count<T extends ElaborationCountArgs>(
      args?: Subset<T, ElaborationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ElaborationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Elaboration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ElaborationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ElaborationAggregateArgs>(args: Subset<T, ElaborationAggregateArgs>): Prisma.PrismaPromise<GetElaborationAggregateType<T>>

    /**
     * Group by Elaboration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ElaborationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ElaborationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ElaborationGroupByArgs['orderBy'] }
        : { orderBy?: ElaborationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ElaborationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetElaborationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Elaboration model
   */
  readonly fields: ElaborationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Elaboration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ElaborationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    recipe<T extends RecipeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RecipeDefaultArgs<ExtArgs>>): Prisma__RecipeClient<$Result.GetResult<Prisma.$RecipePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    ingredients<T extends Elaboration$ingredientsArgs<ExtArgs> = {}>(args?: Subset<T, Elaboration$ingredientsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ElaborationIngredientPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Elaboration model
   */ 
  interface ElaborationFieldRefs {
    readonly id: FieldRef<"Elaboration", 'Int'>
    readonly name: FieldRef<"Elaboration", 'String'>
    readonly date: FieldRef<"Elaboration", 'DateTime'>
    readonly recipeId: FieldRef<"Elaboration", 'Int'>
    readonly createdAt: FieldRef<"Elaboration", 'DateTime'>
    readonly updatedAt: FieldRef<"Elaboration", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Elaboration findUnique
   */
  export type ElaborationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Elaboration
     */
    select?: ElaborationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationInclude<ExtArgs> | null
    /**
     * Filter, which Elaboration to fetch.
     */
    where: ElaborationWhereUniqueInput
  }

  /**
   * Elaboration findUniqueOrThrow
   */
  export type ElaborationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Elaboration
     */
    select?: ElaborationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationInclude<ExtArgs> | null
    /**
     * Filter, which Elaboration to fetch.
     */
    where: ElaborationWhereUniqueInput
  }

  /**
   * Elaboration findFirst
   */
  export type ElaborationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Elaboration
     */
    select?: ElaborationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationInclude<ExtArgs> | null
    /**
     * Filter, which Elaboration to fetch.
     */
    where?: ElaborationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Elaborations to fetch.
     */
    orderBy?: ElaborationOrderByWithRelationInput | ElaborationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Elaborations.
     */
    cursor?: ElaborationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Elaborations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Elaborations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Elaborations.
     */
    distinct?: ElaborationScalarFieldEnum | ElaborationScalarFieldEnum[]
  }

  /**
   * Elaboration findFirstOrThrow
   */
  export type ElaborationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Elaboration
     */
    select?: ElaborationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationInclude<ExtArgs> | null
    /**
     * Filter, which Elaboration to fetch.
     */
    where?: ElaborationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Elaborations to fetch.
     */
    orderBy?: ElaborationOrderByWithRelationInput | ElaborationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Elaborations.
     */
    cursor?: ElaborationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Elaborations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Elaborations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Elaborations.
     */
    distinct?: ElaborationScalarFieldEnum | ElaborationScalarFieldEnum[]
  }

  /**
   * Elaboration findMany
   */
  export type ElaborationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Elaboration
     */
    select?: ElaborationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationInclude<ExtArgs> | null
    /**
     * Filter, which Elaborations to fetch.
     */
    where?: ElaborationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Elaborations to fetch.
     */
    orderBy?: ElaborationOrderByWithRelationInput | ElaborationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Elaborations.
     */
    cursor?: ElaborationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Elaborations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Elaborations.
     */
    skip?: number
    distinct?: ElaborationScalarFieldEnum | ElaborationScalarFieldEnum[]
  }

  /**
   * Elaboration create
   */
  export type ElaborationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Elaboration
     */
    select?: ElaborationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationInclude<ExtArgs> | null
    /**
     * The data needed to create a Elaboration.
     */
    data: XOR<ElaborationCreateInput, ElaborationUncheckedCreateInput>
  }

  /**
   * Elaboration createMany
   */
  export type ElaborationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Elaborations.
     */
    data: ElaborationCreateManyInput | ElaborationCreateManyInput[]
  }

  /**
   * Elaboration createManyAndReturn
   */
  export type ElaborationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Elaboration
     */
    select?: ElaborationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Elaborations.
     */
    data: ElaborationCreateManyInput | ElaborationCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Elaboration update
   */
  export type ElaborationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Elaboration
     */
    select?: ElaborationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationInclude<ExtArgs> | null
    /**
     * The data needed to update a Elaboration.
     */
    data: XOR<ElaborationUpdateInput, ElaborationUncheckedUpdateInput>
    /**
     * Choose, which Elaboration to update.
     */
    where: ElaborationWhereUniqueInput
  }

  /**
   * Elaboration updateMany
   */
  export type ElaborationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Elaborations.
     */
    data: XOR<ElaborationUpdateManyMutationInput, ElaborationUncheckedUpdateManyInput>
    /**
     * Filter which Elaborations to update
     */
    where?: ElaborationWhereInput
  }

  /**
   * Elaboration upsert
   */
  export type ElaborationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Elaboration
     */
    select?: ElaborationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationInclude<ExtArgs> | null
    /**
     * The filter to search for the Elaboration to update in case it exists.
     */
    where: ElaborationWhereUniqueInput
    /**
     * In case the Elaboration found by the `where` argument doesn't exist, create a new Elaboration with this data.
     */
    create: XOR<ElaborationCreateInput, ElaborationUncheckedCreateInput>
    /**
     * In case the Elaboration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ElaborationUpdateInput, ElaborationUncheckedUpdateInput>
  }

  /**
   * Elaboration delete
   */
  export type ElaborationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Elaboration
     */
    select?: ElaborationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationInclude<ExtArgs> | null
    /**
     * Filter which Elaboration to delete.
     */
    where: ElaborationWhereUniqueInput
  }

  /**
   * Elaboration deleteMany
   */
  export type ElaborationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Elaborations to delete
     */
    where?: ElaborationWhereInput
  }

  /**
   * Elaboration.ingredients
   */
  export type Elaboration$ingredientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ElaborationIngredient
     */
    select?: ElaborationIngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationIngredientInclude<ExtArgs> | null
    where?: ElaborationIngredientWhereInput
    orderBy?: ElaborationIngredientOrderByWithRelationInput | ElaborationIngredientOrderByWithRelationInput[]
    cursor?: ElaborationIngredientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ElaborationIngredientScalarFieldEnum | ElaborationIngredientScalarFieldEnum[]
  }

  /**
   * Elaboration without action
   */
  export type ElaborationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Elaboration
     */
    select?: ElaborationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationInclude<ExtArgs> | null
  }


  /**
   * Model ElaborationIngredient
   */

  export type AggregateElaborationIngredient = {
    _count: ElaborationIngredientCountAggregateOutputType | null
    _avg: ElaborationIngredientAvgAggregateOutputType | null
    _sum: ElaborationIngredientSumAggregateOutputType | null
    _min: ElaborationIngredientMinAggregateOutputType | null
    _max: ElaborationIngredientMaxAggregateOutputType | null
  }

  export type ElaborationIngredientAvgAggregateOutputType = {
    id: number | null
    elaborationId: number | null
  }

  export type ElaborationIngredientSumAggregateOutputType = {
    id: number | null
    elaborationId: number | null
  }

  export type ElaborationIngredientMinAggregateOutputType = {
    id: number | null
    elaborationId: number | null
    name: string | null
    lote: string | null
    realAmount: string | null
    unit: string | null
    createdAt: Date | null
  }

  export type ElaborationIngredientMaxAggregateOutputType = {
    id: number | null
    elaborationId: number | null
    name: string | null
    lote: string | null
    realAmount: string | null
    unit: string | null
    createdAt: Date | null
  }

  export type ElaborationIngredientCountAggregateOutputType = {
    id: number
    elaborationId: number
    name: number
    lote: number
    realAmount: number
    unit: number
    createdAt: number
    _all: number
  }


  export type ElaborationIngredientAvgAggregateInputType = {
    id?: true
    elaborationId?: true
  }

  export type ElaborationIngredientSumAggregateInputType = {
    id?: true
    elaborationId?: true
  }

  export type ElaborationIngredientMinAggregateInputType = {
    id?: true
    elaborationId?: true
    name?: true
    lote?: true
    realAmount?: true
    unit?: true
    createdAt?: true
  }

  export type ElaborationIngredientMaxAggregateInputType = {
    id?: true
    elaborationId?: true
    name?: true
    lote?: true
    realAmount?: true
    unit?: true
    createdAt?: true
  }

  export type ElaborationIngredientCountAggregateInputType = {
    id?: true
    elaborationId?: true
    name?: true
    lote?: true
    realAmount?: true
    unit?: true
    createdAt?: true
    _all?: true
  }

  export type ElaborationIngredientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ElaborationIngredient to aggregate.
     */
    where?: ElaborationIngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ElaborationIngredients to fetch.
     */
    orderBy?: ElaborationIngredientOrderByWithRelationInput | ElaborationIngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ElaborationIngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ElaborationIngredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ElaborationIngredients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ElaborationIngredients
    **/
    _count?: true | ElaborationIngredientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ElaborationIngredientAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ElaborationIngredientSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ElaborationIngredientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ElaborationIngredientMaxAggregateInputType
  }

  export type GetElaborationIngredientAggregateType<T extends ElaborationIngredientAggregateArgs> = {
        [P in keyof T & keyof AggregateElaborationIngredient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateElaborationIngredient[P]>
      : GetScalarType<T[P], AggregateElaborationIngredient[P]>
  }




  export type ElaborationIngredientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ElaborationIngredientWhereInput
    orderBy?: ElaborationIngredientOrderByWithAggregationInput | ElaborationIngredientOrderByWithAggregationInput[]
    by: ElaborationIngredientScalarFieldEnum[] | ElaborationIngredientScalarFieldEnum
    having?: ElaborationIngredientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ElaborationIngredientCountAggregateInputType | true
    _avg?: ElaborationIngredientAvgAggregateInputType
    _sum?: ElaborationIngredientSumAggregateInputType
    _min?: ElaborationIngredientMinAggregateInputType
    _max?: ElaborationIngredientMaxAggregateInputType
  }

  export type ElaborationIngredientGroupByOutputType = {
    id: number
    elaborationId: number
    name: string
    lote: string | null
    realAmount: string
    unit: string
    createdAt: Date
    _count: ElaborationIngredientCountAggregateOutputType | null
    _avg: ElaborationIngredientAvgAggregateOutputType | null
    _sum: ElaborationIngredientSumAggregateOutputType | null
    _min: ElaborationIngredientMinAggregateOutputType | null
    _max: ElaborationIngredientMaxAggregateOutputType | null
  }

  type GetElaborationIngredientGroupByPayload<T extends ElaborationIngredientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ElaborationIngredientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ElaborationIngredientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ElaborationIngredientGroupByOutputType[P]>
            : GetScalarType<T[P], ElaborationIngredientGroupByOutputType[P]>
        }
      >
    >


  export type ElaborationIngredientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    elaborationId?: boolean
    name?: boolean
    lote?: boolean
    realAmount?: boolean
    unit?: boolean
    createdAt?: boolean
    elaboration?: boolean | ElaborationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["elaborationIngredient"]>

  export type ElaborationIngredientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    elaborationId?: boolean
    name?: boolean
    lote?: boolean
    realAmount?: boolean
    unit?: boolean
    createdAt?: boolean
    elaboration?: boolean | ElaborationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["elaborationIngredient"]>

  export type ElaborationIngredientSelectScalar = {
    id?: boolean
    elaborationId?: boolean
    name?: boolean
    lote?: boolean
    realAmount?: boolean
    unit?: boolean
    createdAt?: boolean
  }

  export type ElaborationIngredientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    elaboration?: boolean | ElaborationDefaultArgs<ExtArgs>
  }
  export type ElaborationIngredientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    elaboration?: boolean | ElaborationDefaultArgs<ExtArgs>
  }

  export type $ElaborationIngredientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ElaborationIngredient"
    objects: {
      elaboration: Prisma.$ElaborationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      elaborationId: number
      name: string
      lote: string | null
      realAmount: string
      unit: string
      createdAt: Date
    }, ExtArgs["result"]["elaborationIngredient"]>
    composites: {}
  }

  type ElaborationIngredientGetPayload<S extends boolean | null | undefined | ElaborationIngredientDefaultArgs> = $Result.GetResult<Prisma.$ElaborationIngredientPayload, S>

  type ElaborationIngredientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ElaborationIngredientFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ElaborationIngredientCountAggregateInputType | true
    }

  export interface ElaborationIngredientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ElaborationIngredient'], meta: { name: 'ElaborationIngredient' } }
    /**
     * Find zero or one ElaborationIngredient that matches the filter.
     * @param {ElaborationIngredientFindUniqueArgs} args - Arguments to find a ElaborationIngredient
     * @example
     * // Get one ElaborationIngredient
     * const elaborationIngredient = await prisma.elaborationIngredient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ElaborationIngredientFindUniqueArgs>(args: SelectSubset<T, ElaborationIngredientFindUniqueArgs<ExtArgs>>): Prisma__ElaborationIngredientClient<$Result.GetResult<Prisma.$ElaborationIngredientPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ElaborationIngredient that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ElaborationIngredientFindUniqueOrThrowArgs} args - Arguments to find a ElaborationIngredient
     * @example
     * // Get one ElaborationIngredient
     * const elaborationIngredient = await prisma.elaborationIngredient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ElaborationIngredientFindUniqueOrThrowArgs>(args: SelectSubset<T, ElaborationIngredientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ElaborationIngredientClient<$Result.GetResult<Prisma.$ElaborationIngredientPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ElaborationIngredient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ElaborationIngredientFindFirstArgs} args - Arguments to find a ElaborationIngredient
     * @example
     * // Get one ElaborationIngredient
     * const elaborationIngredient = await prisma.elaborationIngredient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ElaborationIngredientFindFirstArgs>(args?: SelectSubset<T, ElaborationIngredientFindFirstArgs<ExtArgs>>): Prisma__ElaborationIngredientClient<$Result.GetResult<Prisma.$ElaborationIngredientPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ElaborationIngredient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ElaborationIngredientFindFirstOrThrowArgs} args - Arguments to find a ElaborationIngredient
     * @example
     * // Get one ElaborationIngredient
     * const elaborationIngredient = await prisma.elaborationIngredient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ElaborationIngredientFindFirstOrThrowArgs>(args?: SelectSubset<T, ElaborationIngredientFindFirstOrThrowArgs<ExtArgs>>): Prisma__ElaborationIngredientClient<$Result.GetResult<Prisma.$ElaborationIngredientPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ElaborationIngredients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ElaborationIngredientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ElaborationIngredients
     * const elaborationIngredients = await prisma.elaborationIngredient.findMany()
     * 
     * // Get first 10 ElaborationIngredients
     * const elaborationIngredients = await prisma.elaborationIngredient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const elaborationIngredientWithIdOnly = await prisma.elaborationIngredient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ElaborationIngredientFindManyArgs>(args?: SelectSubset<T, ElaborationIngredientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ElaborationIngredientPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ElaborationIngredient.
     * @param {ElaborationIngredientCreateArgs} args - Arguments to create a ElaborationIngredient.
     * @example
     * // Create one ElaborationIngredient
     * const ElaborationIngredient = await prisma.elaborationIngredient.create({
     *   data: {
     *     // ... data to create a ElaborationIngredient
     *   }
     * })
     * 
     */
    create<T extends ElaborationIngredientCreateArgs>(args: SelectSubset<T, ElaborationIngredientCreateArgs<ExtArgs>>): Prisma__ElaborationIngredientClient<$Result.GetResult<Prisma.$ElaborationIngredientPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ElaborationIngredients.
     * @param {ElaborationIngredientCreateManyArgs} args - Arguments to create many ElaborationIngredients.
     * @example
     * // Create many ElaborationIngredients
     * const elaborationIngredient = await prisma.elaborationIngredient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ElaborationIngredientCreateManyArgs>(args?: SelectSubset<T, ElaborationIngredientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ElaborationIngredients and returns the data saved in the database.
     * @param {ElaborationIngredientCreateManyAndReturnArgs} args - Arguments to create many ElaborationIngredients.
     * @example
     * // Create many ElaborationIngredients
     * const elaborationIngredient = await prisma.elaborationIngredient.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ElaborationIngredients and only return the `id`
     * const elaborationIngredientWithIdOnly = await prisma.elaborationIngredient.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ElaborationIngredientCreateManyAndReturnArgs>(args?: SelectSubset<T, ElaborationIngredientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ElaborationIngredientPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ElaborationIngredient.
     * @param {ElaborationIngredientDeleteArgs} args - Arguments to delete one ElaborationIngredient.
     * @example
     * // Delete one ElaborationIngredient
     * const ElaborationIngredient = await prisma.elaborationIngredient.delete({
     *   where: {
     *     // ... filter to delete one ElaborationIngredient
     *   }
     * })
     * 
     */
    delete<T extends ElaborationIngredientDeleteArgs>(args: SelectSubset<T, ElaborationIngredientDeleteArgs<ExtArgs>>): Prisma__ElaborationIngredientClient<$Result.GetResult<Prisma.$ElaborationIngredientPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ElaborationIngredient.
     * @param {ElaborationIngredientUpdateArgs} args - Arguments to update one ElaborationIngredient.
     * @example
     * // Update one ElaborationIngredient
     * const elaborationIngredient = await prisma.elaborationIngredient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ElaborationIngredientUpdateArgs>(args: SelectSubset<T, ElaborationIngredientUpdateArgs<ExtArgs>>): Prisma__ElaborationIngredientClient<$Result.GetResult<Prisma.$ElaborationIngredientPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ElaborationIngredients.
     * @param {ElaborationIngredientDeleteManyArgs} args - Arguments to filter ElaborationIngredients to delete.
     * @example
     * // Delete a few ElaborationIngredients
     * const { count } = await prisma.elaborationIngredient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ElaborationIngredientDeleteManyArgs>(args?: SelectSubset<T, ElaborationIngredientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ElaborationIngredients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ElaborationIngredientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ElaborationIngredients
     * const elaborationIngredient = await prisma.elaborationIngredient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ElaborationIngredientUpdateManyArgs>(args: SelectSubset<T, ElaborationIngredientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ElaborationIngredient.
     * @param {ElaborationIngredientUpsertArgs} args - Arguments to update or create a ElaborationIngredient.
     * @example
     * // Update or create a ElaborationIngredient
     * const elaborationIngredient = await prisma.elaborationIngredient.upsert({
     *   create: {
     *     // ... data to create a ElaborationIngredient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ElaborationIngredient we want to update
     *   }
     * })
     */
    upsert<T extends ElaborationIngredientUpsertArgs>(args: SelectSubset<T, ElaborationIngredientUpsertArgs<ExtArgs>>): Prisma__ElaborationIngredientClient<$Result.GetResult<Prisma.$ElaborationIngredientPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ElaborationIngredients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ElaborationIngredientCountArgs} args - Arguments to filter ElaborationIngredients to count.
     * @example
     * // Count the number of ElaborationIngredients
     * const count = await prisma.elaborationIngredient.count({
     *   where: {
     *     // ... the filter for the ElaborationIngredients we want to count
     *   }
     * })
    **/
    count<T extends ElaborationIngredientCountArgs>(
      args?: Subset<T, ElaborationIngredientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ElaborationIngredientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ElaborationIngredient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ElaborationIngredientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ElaborationIngredientAggregateArgs>(args: Subset<T, ElaborationIngredientAggregateArgs>): Prisma.PrismaPromise<GetElaborationIngredientAggregateType<T>>

    /**
     * Group by ElaborationIngredient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ElaborationIngredientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ElaborationIngredientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ElaborationIngredientGroupByArgs['orderBy'] }
        : { orderBy?: ElaborationIngredientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ElaborationIngredientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetElaborationIngredientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ElaborationIngredient model
   */
  readonly fields: ElaborationIngredientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ElaborationIngredient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ElaborationIngredientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    elaboration<T extends ElaborationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ElaborationDefaultArgs<ExtArgs>>): Prisma__ElaborationClient<$Result.GetResult<Prisma.$ElaborationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ElaborationIngredient model
   */ 
  interface ElaborationIngredientFieldRefs {
    readonly id: FieldRef<"ElaborationIngredient", 'Int'>
    readonly elaborationId: FieldRef<"ElaborationIngredient", 'Int'>
    readonly name: FieldRef<"ElaborationIngredient", 'String'>
    readonly lote: FieldRef<"ElaborationIngredient", 'String'>
    readonly realAmount: FieldRef<"ElaborationIngredient", 'String'>
    readonly unit: FieldRef<"ElaborationIngredient", 'String'>
    readonly createdAt: FieldRef<"ElaborationIngredient", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ElaborationIngredient findUnique
   */
  export type ElaborationIngredientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ElaborationIngredient
     */
    select?: ElaborationIngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationIngredientInclude<ExtArgs> | null
    /**
     * Filter, which ElaborationIngredient to fetch.
     */
    where: ElaborationIngredientWhereUniqueInput
  }

  /**
   * ElaborationIngredient findUniqueOrThrow
   */
  export type ElaborationIngredientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ElaborationIngredient
     */
    select?: ElaborationIngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationIngredientInclude<ExtArgs> | null
    /**
     * Filter, which ElaborationIngredient to fetch.
     */
    where: ElaborationIngredientWhereUniqueInput
  }

  /**
   * ElaborationIngredient findFirst
   */
  export type ElaborationIngredientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ElaborationIngredient
     */
    select?: ElaborationIngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationIngredientInclude<ExtArgs> | null
    /**
     * Filter, which ElaborationIngredient to fetch.
     */
    where?: ElaborationIngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ElaborationIngredients to fetch.
     */
    orderBy?: ElaborationIngredientOrderByWithRelationInput | ElaborationIngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ElaborationIngredients.
     */
    cursor?: ElaborationIngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ElaborationIngredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ElaborationIngredients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ElaborationIngredients.
     */
    distinct?: ElaborationIngredientScalarFieldEnum | ElaborationIngredientScalarFieldEnum[]
  }

  /**
   * ElaborationIngredient findFirstOrThrow
   */
  export type ElaborationIngredientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ElaborationIngredient
     */
    select?: ElaborationIngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationIngredientInclude<ExtArgs> | null
    /**
     * Filter, which ElaborationIngredient to fetch.
     */
    where?: ElaborationIngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ElaborationIngredients to fetch.
     */
    orderBy?: ElaborationIngredientOrderByWithRelationInput | ElaborationIngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ElaborationIngredients.
     */
    cursor?: ElaborationIngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ElaborationIngredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ElaborationIngredients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ElaborationIngredients.
     */
    distinct?: ElaborationIngredientScalarFieldEnum | ElaborationIngredientScalarFieldEnum[]
  }

  /**
   * ElaborationIngredient findMany
   */
  export type ElaborationIngredientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ElaborationIngredient
     */
    select?: ElaborationIngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationIngredientInclude<ExtArgs> | null
    /**
     * Filter, which ElaborationIngredients to fetch.
     */
    where?: ElaborationIngredientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ElaborationIngredients to fetch.
     */
    orderBy?: ElaborationIngredientOrderByWithRelationInput | ElaborationIngredientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ElaborationIngredients.
     */
    cursor?: ElaborationIngredientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ElaborationIngredients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ElaborationIngredients.
     */
    skip?: number
    distinct?: ElaborationIngredientScalarFieldEnum | ElaborationIngredientScalarFieldEnum[]
  }

  /**
   * ElaborationIngredient create
   */
  export type ElaborationIngredientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ElaborationIngredient
     */
    select?: ElaborationIngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationIngredientInclude<ExtArgs> | null
    /**
     * The data needed to create a ElaborationIngredient.
     */
    data: XOR<ElaborationIngredientCreateInput, ElaborationIngredientUncheckedCreateInput>
  }

  /**
   * ElaborationIngredient createMany
   */
  export type ElaborationIngredientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ElaborationIngredients.
     */
    data: ElaborationIngredientCreateManyInput | ElaborationIngredientCreateManyInput[]
  }

  /**
   * ElaborationIngredient createManyAndReturn
   */
  export type ElaborationIngredientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ElaborationIngredient
     */
    select?: ElaborationIngredientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ElaborationIngredients.
     */
    data: ElaborationIngredientCreateManyInput | ElaborationIngredientCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationIngredientIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ElaborationIngredient update
   */
  export type ElaborationIngredientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ElaborationIngredient
     */
    select?: ElaborationIngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationIngredientInclude<ExtArgs> | null
    /**
     * The data needed to update a ElaborationIngredient.
     */
    data: XOR<ElaborationIngredientUpdateInput, ElaborationIngredientUncheckedUpdateInput>
    /**
     * Choose, which ElaborationIngredient to update.
     */
    where: ElaborationIngredientWhereUniqueInput
  }

  /**
   * ElaborationIngredient updateMany
   */
  export type ElaborationIngredientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ElaborationIngredients.
     */
    data: XOR<ElaborationIngredientUpdateManyMutationInput, ElaborationIngredientUncheckedUpdateManyInput>
    /**
     * Filter which ElaborationIngredients to update
     */
    where?: ElaborationIngredientWhereInput
  }

  /**
   * ElaborationIngredient upsert
   */
  export type ElaborationIngredientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ElaborationIngredient
     */
    select?: ElaborationIngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationIngredientInclude<ExtArgs> | null
    /**
     * The filter to search for the ElaborationIngredient to update in case it exists.
     */
    where: ElaborationIngredientWhereUniqueInput
    /**
     * In case the ElaborationIngredient found by the `where` argument doesn't exist, create a new ElaborationIngredient with this data.
     */
    create: XOR<ElaborationIngredientCreateInput, ElaborationIngredientUncheckedCreateInput>
    /**
     * In case the ElaborationIngredient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ElaborationIngredientUpdateInput, ElaborationIngredientUncheckedUpdateInput>
  }

  /**
   * ElaborationIngredient delete
   */
  export type ElaborationIngredientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ElaborationIngredient
     */
    select?: ElaborationIngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationIngredientInclude<ExtArgs> | null
    /**
     * Filter which ElaborationIngredient to delete.
     */
    where: ElaborationIngredientWhereUniqueInput
  }

  /**
   * ElaborationIngredient deleteMany
   */
  export type ElaborationIngredientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ElaborationIngredients to delete
     */
    where?: ElaborationIngredientWhereInput
  }

  /**
   * ElaborationIngredient without action
   */
  export type ElaborationIngredientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ElaborationIngredient
     */
    select?: ElaborationIngredientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ElaborationIngredientInclude<ExtArgs> | null
  }


  /**
   * Model CleaningZone
   */

  export type AggregateCleaningZone = {
    _count: CleaningZoneCountAggregateOutputType | null
    _avg: CleaningZoneAvgAggregateOutputType | null
    _sum: CleaningZoneSumAggregateOutputType | null
    _min: CleaningZoneMinAggregateOutputType | null
    _max: CleaningZoneMaxAggregateOutputType | null
  }

  export type CleaningZoneAvgAggregateOutputType = {
    id: number | null
    clientProfileId: number | null
  }

  export type CleaningZoneSumAggregateOutputType = {
    id: number | null
    clientProfileId: number | null
  }

  export type CleaningZoneMinAggregateOutputType = {
    id: number | null
    name: string | null
    clientProfileId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CleaningZoneMaxAggregateOutputType = {
    id: number | null
    name: string | null
    clientProfileId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CleaningZoneCountAggregateOutputType = {
    id: number
    name: number
    clientProfileId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CleaningZoneAvgAggregateInputType = {
    id?: true
    clientProfileId?: true
  }

  export type CleaningZoneSumAggregateInputType = {
    id?: true
    clientProfileId?: true
  }

  export type CleaningZoneMinAggregateInputType = {
    id?: true
    name?: true
    clientProfileId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CleaningZoneMaxAggregateInputType = {
    id?: true
    name?: true
    clientProfileId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CleaningZoneCountAggregateInputType = {
    id?: true
    name?: true
    clientProfileId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CleaningZoneAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CleaningZone to aggregate.
     */
    where?: CleaningZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CleaningZones to fetch.
     */
    orderBy?: CleaningZoneOrderByWithRelationInput | CleaningZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CleaningZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CleaningZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CleaningZones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CleaningZones
    **/
    _count?: true | CleaningZoneCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CleaningZoneAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CleaningZoneSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CleaningZoneMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CleaningZoneMaxAggregateInputType
  }

  export type GetCleaningZoneAggregateType<T extends CleaningZoneAggregateArgs> = {
        [P in keyof T & keyof AggregateCleaningZone]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCleaningZone[P]>
      : GetScalarType<T[P], AggregateCleaningZone[P]>
  }




  export type CleaningZoneGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CleaningZoneWhereInput
    orderBy?: CleaningZoneOrderByWithAggregationInput | CleaningZoneOrderByWithAggregationInput[]
    by: CleaningZoneScalarFieldEnum[] | CleaningZoneScalarFieldEnum
    having?: CleaningZoneScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CleaningZoneCountAggregateInputType | true
    _avg?: CleaningZoneAvgAggregateInputType
    _sum?: CleaningZoneSumAggregateInputType
    _min?: CleaningZoneMinAggregateInputType
    _max?: CleaningZoneMaxAggregateInputType
  }

  export type CleaningZoneGroupByOutputType = {
    id: number
    name: string
    clientProfileId: number
    createdAt: Date
    updatedAt: Date
    _count: CleaningZoneCountAggregateOutputType | null
    _avg: CleaningZoneAvgAggregateOutputType | null
    _sum: CleaningZoneSumAggregateOutputType | null
    _min: CleaningZoneMinAggregateOutputType | null
    _max: CleaningZoneMaxAggregateOutputType | null
  }

  type GetCleaningZoneGroupByPayload<T extends CleaningZoneGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CleaningZoneGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CleaningZoneGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CleaningZoneGroupByOutputType[P]>
            : GetScalarType<T[P], CleaningZoneGroupByOutputType[P]>
        }
      >
    >


  export type CleaningZoneSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    clientProfileId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
    logs?: boolean | CleaningZone$logsArgs<ExtArgs>
    _count?: boolean | CleaningZoneCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cleaningZone"]>

  export type CleaningZoneSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    clientProfileId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cleaningZone"]>

  export type CleaningZoneSelectScalar = {
    id?: boolean
    name?: boolean
    clientProfileId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CleaningZoneInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
    logs?: boolean | CleaningZone$logsArgs<ExtArgs>
    _count?: boolean | CleaningZoneCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CleaningZoneIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
  }

  export type $CleaningZonePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CleaningZone"
    objects: {
      clientProfile: Prisma.$ClientProfilePayload<ExtArgs>
      logs: Prisma.$CleaningLogZonePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      clientProfileId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cleaningZone"]>
    composites: {}
  }

  type CleaningZoneGetPayload<S extends boolean | null | undefined | CleaningZoneDefaultArgs> = $Result.GetResult<Prisma.$CleaningZonePayload, S>

  type CleaningZoneCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CleaningZoneFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CleaningZoneCountAggregateInputType | true
    }

  export interface CleaningZoneDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CleaningZone'], meta: { name: 'CleaningZone' } }
    /**
     * Find zero or one CleaningZone that matches the filter.
     * @param {CleaningZoneFindUniqueArgs} args - Arguments to find a CleaningZone
     * @example
     * // Get one CleaningZone
     * const cleaningZone = await prisma.cleaningZone.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CleaningZoneFindUniqueArgs>(args: SelectSubset<T, CleaningZoneFindUniqueArgs<ExtArgs>>): Prisma__CleaningZoneClient<$Result.GetResult<Prisma.$CleaningZonePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CleaningZone that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CleaningZoneFindUniqueOrThrowArgs} args - Arguments to find a CleaningZone
     * @example
     * // Get one CleaningZone
     * const cleaningZone = await prisma.cleaningZone.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CleaningZoneFindUniqueOrThrowArgs>(args: SelectSubset<T, CleaningZoneFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CleaningZoneClient<$Result.GetResult<Prisma.$CleaningZonePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CleaningZone that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningZoneFindFirstArgs} args - Arguments to find a CleaningZone
     * @example
     * // Get one CleaningZone
     * const cleaningZone = await prisma.cleaningZone.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CleaningZoneFindFirstArgs>(args?: SelectSubset<T, CleaningZoneFindFirstArgs<ExtArgs>>): Prisma__CleaningZoneClient<$Result.GetResult<Prisma.$CleaningZonePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CleaningZone that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningZoneFindFirstOrThrowArgs} args - Arguments to find a CleaningZone
     * @example
     * // Get one CleaningZone
     * const cleaningZone = await prisma.cleaningZone.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CleaningZoneFindFirstOrThrowArgs>(args?: SelectSubset<T, CleaningZoneFindFirstOrThrowArgs<ExtArgs>>): Prisma__CleaningZoneClient<$Result.GetResult<Prisma.$CleaningZonePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CleaningZones that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningZoneFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CleaningZones
     * const cleaningZones = await prisma.cleaningZone.findMany()
     * 
     * // Get first 10 CleaningZones
     * const cleaningZones = await prisma.cleaningZone.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cleaningZoneWithIdOnly = await prisma.cleaningZone.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CleaningZoneFindManyArgs>(args?: SelectSubset<T, CleaningZoneFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CleaningZonePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CleaningZone.
     * @param {CleaningZoneCreateArgs} args - Arguments to create a CleaningZone.
     * @example
     * // Create one CleaningZone
     * const CleaningZone = await prisma.cleaningZone.create({
     *   data: {
     *     // ... data to create a CleaningZone
     *   }
     * })
     * 
     */
    create<T extends CleaningZoneCreateArgs>(args: SelectSubset<T, CleaningZoneCreateArgs<ExtArgs>>): Prisma__CleaningZoneClient<$Result.GetResult<Prisma.$CleaningZonePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CleaningZones.
     * @param {CleaningZoneCreateManyArgs} args - Arguments to create many CleaningZones.
     * @example
     * // Create many CleaningZones
     * const cleaningZone = await prisma.cleaningZone.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CleaningZoneCreateManyArgs>(args?: SelectSubset<T, CleaningZoneCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CleaningZones and returns the data saved in the database.
     * @param {CleaningZoneCreateManyAndReturnArgs} args - Arguments to create many CleaningZones.
     * @example
     * // Create many CleaningZones
     * const cleaningZone = await prisma.cleaningZone.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CleaningZones and only return the `id`
     * const cleaningZoneWithIdOnly = await prisma.cleaningZone.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CleaningZoneCreateManyAndReturnArgs>(args?: SelectSubset<T, CleaningZoneCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CleaningZonePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CleaningZone.
     * @param {CleaningZoneDeleteArgs} args - Arguments to delete one CleaningZone.
     * @example
     * // Delete one CleaningZone
     * const CleaningZone = await prisma.cleaningZone.delete({
     *   where: {
     *     // ... filter to delete one CleaningZone
     *   }
     * })
     * 
     */
    delete<T extends CleaningZoneDeleteArgs>(args: SelectSubset<T, CleaningZoneDeleteArgs<ExtArgs>>): Prisma__CleaningZoneClient<$Result.GetResult<Prisma.$CleaningZonePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CleaningZone.
     * @param {CleaningZoneUpdateArgs} args - Arguments to update one CleaningZone.
     * @example
     * // Update one CleaningZone
     * const cleaningZone = await prisma.cleaningZone.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CleaningZoneUpdateArgs>(args: SelectSubset<T, CleaningZoneUpdateArgs<ExtArgs>>): Prisma__CleaningZoneClient<$Result.GetResult<Prisma.$CleaningZonePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CleaningZones.
     * @param {CleaningZoneDeleteManyArgs} args - Arguments to filter CleaningZones to delete.
     * @example
     * // Delete a few CleaningZones
     * const { count } = await prisma.cleaningZone.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CleaningZoneDeleteManyArgs>(args?: SelectSubset<T, CleaningZoneDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CleaningZones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningZoneUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CleaningZones
     * const cleaningZone = await prisma.cleaningZone.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CleaningZoneUpdateManyArgs>(args: SelectSubset<T, CleaningZoneUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CleaningZone.
     * @param {CleaningZoneUpsertArgs} args - Arguments to update or create a CleaningZone.
     * @example
     * // Update or create a CleaningZone
     * const cleaningZone = await prisma.cleaningZone.upsert({
     *   create: {
     *     // ... data to create a CleaningZone
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CleaningZone we want to update
     *   }
     * })
     */
    upsert<T extends CleaningZoneUpsertArgs>(args: SelectSubset<T, CleaningZoneUpsertArgs<ExtArgs>>): Prisma__CleaningZoneClient<$Result.GetResult<Prisma.$CleaningZonePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CleaningZones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningZoneCountArgs} args - Arguments to filter CleaningZones to count.
     * @example
     * // Count the number of CleaningZones
     * const count = await prisma.cleaningZone.count({
     *   where: {
     *     // ... the filter for the CleaningZones we want to count
     *   }
     * })
    **/
    count<T extends CleaningZoneCountArgs>(
      args?: Subset<T, CleaningZoneCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CleaningZoneCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CleaningZone.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningZoneAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CleaningZoneAggregateArgs>(args: Subset<T, CleaningZoneAggregateArgs>): Prisma.PrismaPromise<GetCleaningZoneAggregateType<T>>

    /**
     * Group by CleaningZone.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningZoneGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CleaningZoneGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CleaningZoneGroupByArgs['orderBy'] }
        : { orderBy?: CleaningZoneGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CleaningZoneGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCleaningZoneGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CleaningZone model
   */
  readonly fields: CleaningZoneFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CleaningZone.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CleaningZoneClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clientProfile<T extends ClientProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientProfileDefaultArgs<ExtArgs>>): Prisma__ClientProfileClient<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    logs<T extends CleaningZone$logsArgs<ExtArgs> = {}>(args?: Subset<T, CleaningZone$logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CleaningLogZonePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CleaningZone model
   */ 
  interface CleaningZoneFieldRefs {
    readonly id: FieldRef<"CleaningZone", 'Int'>
    readonly name: FieldRef<"CleaningZone", 'String'>
    readonly clientProfileId: FieldRef<"CleaningZone", 'Int'>
    readonly createdAt: FieldRef<"CleaningZone", 'DateTime'>
    readonly updatedAt: FieldRef<"CleaningZone", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CleaningZone findUnique
   */
  export type CleaningZoneFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningZone
     */
    select?: CleaningZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningZoneInclude<ExtArgs> | null
    /**
     * Filter, which CleaningZone to fetch.
     */
    where: CleaningZoneWhereUniqueInput
  }

  /**
   * CleaningZone findUniqueOrThrow
   */
  export type CleaningZoneFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningZone
     */
    select?: CleaningZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningZoneInclude<ExtArgs> | null
    /**
     * Filter, which CleaningZone to fetch.
     */
    where: CleaningZoneWhereUniqueInput
  }

  /**
   * CleaningZone findFirst
   */
  export type CleaningZoneFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningZone
     */
    select?: CleaningZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningZoneInclude<ExtArgs> | null
    /**
     * Filter, which CleaningZone to fetch.
     */
    where?: CleaningZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CleaningZones to fetch.
     */
    orderBy?: CleaningZoneOrderByWithRelationInput | CleaningZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CleaningZones.
     */
    cursor?: CleaningZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CleaningZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CleaningZones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CleaningZones.
     */
    distinct?: CleaningZoneScalarFieldEnum | CleaningZoneScalarFieldEnum[]
  }

  /**
   * CleaningZone findFirstOrThrow
   */
  export type CleaningZoneFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningZone
     */
    select?: CleaningZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningZoneInclude<ExtArgs> | null
    /**
     * Filter, which CleaningZone to fetch.
     */
    where?: CleaningZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CleaningZones to fetch.
     */
    orderBy?: CleaningZoneOrderByWithRelationInput | CleaningZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CleaningZones.
     */
    cursor?: CleaningZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CleaningZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CleaningZones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CleaningZones.
     */
    distinct?: CleaningZoneScalarFieldEnum | CleaningZoneScalarFieldEnum[]
  }

  /**
   * CleaningZone findMany
   */
  export type CleaningZoneFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningZone
     */
    select?: CleaningZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningZoneInclude<ExtArgs> | null
    /**
     * Filter, which CleaningZones to fetch.
     */
    where?: CleaningZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CleaningZones to fetch.
     */
    orderBy?: CleaningZoneOrderByWithRelationInput | CleaningZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CleaningZones.
     */
    cursor?: CleaningZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CleaningZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CleaningZones.
     */
    skip?: number
    distinct?: CleaningZoneScalarFieldEnum | CleaningZoneScalarFieldEnum[]
  }

  /**
   * CleaningZone create
   */
  export type CleaningZoneCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningZone
     */
    select?: CleaningZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningZoneInclude<ExtArgs> | null
    /**
     * The data needed to create a CleaningZone.
     */
    data: XOR<CleaningZoneCreateInput, CleaningZoneUncheckedCreateInput>
  }

  /**
   * CleaningZone createMany
   */
  export type CleaningZoneCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CleaningZones.
     */
    data: CleaningZoneCreateManyInput | CleaningZoneCreateManyInput[]
  }

  /**
   * CleaningZone createManyAndReturn
   */
  export type CleaningZoneCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningZone
     */
    select?: CleaningZoneSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CleaningZones.
     */
    data: CleaningZoneCreateManyInput | CleaningZoneCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningZoneIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CleaningZone update
   */
  export type CleaningZoneUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningZone
     */
    select?: CleaningZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningZoneInclude<ExtArgs> | null
    /**
     * The data needed to update a CleaningZone.
     */
    data: XOR<CleaningZoneUpdateInput, CleaningZoneUncheckedUpdateInput>
    /**
     * Choose, which CleaningZone to update.
     */
    where: CleaningZoneWhereUniqueInput
  }

  /**
   * CleaningZone updateMany
   */
  export type CleaningZoneUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CleaningZones.
     */
    data: XOR<CleaningZoneUpdateManyMutationInput, CleaningZoneUncheckedUpdateManyInput>
    /**
     * Filter which CleaningZones to update
     */
    where?: CleaningZoneWhereInput
  }

  /**
   * CleaningZone upsert
   */
  export type CleaningZoneUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningZone
     */
    select?: CleaningZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningZoneInclude<ExtArgs> | null
    /**
     * The filter to search for the CleaningZone to update in case it exists.
     */
    where: CleaningZoneWhereUniqueInput
    /**
     * In case the CleaningZone found by the `where` argument doesn't exist, create a new CleaningZone with this data.
     */
    create: XOR<CleaningZoneCreateInput, CleaningZoneUncheckedCreateInput>
    /**
     * In case the CleaningZone was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CleaningZoneUpdateInput, CleaningZoneUncheckedUpdateInput>
  }

  /**
   * CleaningZone delete
   */
  export type CleaningZoneDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningZone
     */
    select?: CleaningZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningZoneInclude<ExtArgs> | null
    /**
     * Filter which CleaningZone to delete.
     */
    where: CleaningZoneWhereUniqueInput
  }

  /**
   * CleaningZone deleteMany
   */
  export type CleaningZoneDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CleaningZones to delete
     */
    where?: CleaningZoneWhereInput
  }

  /**
   * CleaningZone.logs
   */
  export type CleaningZone$logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLogZone
     */
    select?: CleaningLogZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogZoneInclude<ExtArgs> | null
    where?: CleaningLogZoneWhereInput
    orderBy?: CleaningLogZoneOrderByWithRelationInput | CleaningLogZoneOrderByWithRelationInput[]
    cursor?: CleaningLogZoneWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CleaningLogZoneScalarFieldEnum | CleaningLogZoneScalarFieldEnum[]
  }

  /**
   * CleaningZone without action
   */
  export type CleaningZoneDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningZone
     */
    select?: CleaningZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningZoneInclude<ExtArgs> | null
  }


  /**
   * Model CleaningLog
   */

  export type AggregateCleaningLog = {
    _count: CleaningLogCountAggregateOutputType | null
    _avg: CleaningLogAvgAggregateOutputType | null
    _sum: CleaningLogSumAggregateOutputType | null
    _min: CleaningLogMinAggregateOutputType | null
    _max: CleaningLogMaxAggregateOutputType | null
  }

  export type CleaningLogAvgAggregateOutputType = {
    id: number | null
    clientProfileId: number | null
  }

  export type CleaningLogSumAggregateOutputType = {
    id: number | null
    clientProfileId: number | null
  }

  export type CleaningLogMinAggregateOutputType = {
    id: number | null
    personName: string | null
    date: Date | null
    clientProfileId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CleaningLogMaxAggregateOutputType = {
    id: number | null
    personName: string | null
    date: Date | null
    clientProfileId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CleaningLogCountAggregateOutputType = {
    id: number
    personName: number
    date: number
    clientProfileId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CleaningLogAvgAggregateInputType = {
    id?: true
    clientProfileId?: true
  }

  export type CleaningLogSumAggregateInputType = {
    id?: true
    clientProfileId?: true
  }

  export type CleaningLogMinAggregateInputType = {
    id?: true
    personName?: true
    date?: true
    clientProfileId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CleaningLogMaxAggregateInputType = {
    id?: true
    personName?: true
    date?: true
    clientProfileId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CleaningLogCountAggregateInputType = {
    id?: true
    personName?: true
    date?: true
    clientProfileId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CleaningLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CleaningLog to aggregate.
     */
    where?: CleaningLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CleaningLogs to fetch.
     */
    orderBy?: CleaningLogOrderByWithRelationInput | CleaningLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CleaningLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CleaningLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CleaningLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CleaningLogs
    **/
    _count?: true | CleaningLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CleaningLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CleaningLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CleaningLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CleaningLogMaxAggregateInputType
  }

  export type GetCleaningLogAggregateType<T extends CleaningLogAggregateArgs> = {
        [P in keyof T & keyof AggregateCleaningLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCleaningLog[P]>
      : GetScalarType<T[P], AggregateCleaningLog[P]>
  }




  export type CleaningLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CleaningLogWhereInput
    orderBy?: CleaningLogOrderByWithAggregationInput | CleaningLogOrderByWithAggregationInput[]
    by: CleaningLogScalarFieldEnum[] | CleaningLogScalarFieldEnum
    having?: CleaningLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CleaningLogCountAggregateInputType | true
    _avg?: CleaningLogAvgAggregateInputType
    _sum?: CleaningLogSumAggregateInputType
    _min?: CleaningLogMinAggregateInputType
    _max?: CleaningLogMaxAggregateInputType
  }

  export type CleaningLogGroupByOutputType = {
    id: number
    personName: string
    date: Date
    clientProfileId: number
    createdAt: Date
    updatedAt: Date
    _count: CleaningLogCountAggregateOutputType | null
    _avg: CleaningLogAvgAggregateOutputType | null
    _sum: CleaningLogSumAggregateOutputType | null
    _min: CleaningLogMinAggregateOutputType | null
    _max: CleaningLogMaxAggregateOutputType | null
  }

  type GetCleaningLogGroupByPayload<T extends CleaningLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CleaningLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CleaningLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CleaningLogGroupByOutputType[P]>
            : GetScalarType<T[P], CleaningLogGroupByOutputType[P]>
        }
      >
    >


  export type CleaningLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    personName?: boolean
    date?: boolean
    clientProfileId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
    zones?: boolean | CleaningLog$zonesArgs<ExtArgs>
    _count?: boolean | CleaningLogCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cleaningLog"]>

  export type CleaningLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    personName?: boolean
    date?: boolean
    clientProfileId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cleaningLog"]>

  export type CleaningLogSelectScalar = {
    id?: boolean
    personName?: boolean
    date?: boolean
    clientProfileId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CleaningLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
    zones?: boolean | CleaningLog$zonesArgs<ExtArgs>
    _count?: boolean | CleaningLogCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CleaningLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
  }

  export type $CleaningLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CleaningLog"
    objects: {
      clientProfile: Prisma.$ClientProfilePayload<ExtArgs>
      zones: Prisma.$CleaningLogZonePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      personName: string
      date: Date
      clientProfileId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cleaningLog"]>
    composites: {}
  }

  type CleaningLogGetPayload<S extends boolean | null | undefined | CleaningLogDefaultArgs> = $Result.GetResult<Prisma.$CleaningLogPayload, S>

  type CleaningLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CleaningLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CleaningLogCountAggregateInputType | true
    }

  export interface CleaningLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CleaningLog'], meta: { name: 'CleaningLog' } }
    /**
     * Find zero or one CleaningLog that matches the filter.
     * @param {CleaningLogFindUniqueArgs} args - Arguments to find a CleaningLog
     * @example
     * // Get one CleaningLog
     * const cleaningLog = await prisma.cleaningLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CleaningLogFindUniqueArgs>(args: SelectSubset<T, CleaningLogFindUniqueArgs<ExtArgs>>): Prisma__CleaningLogClient<$Result.GetResult<Prisma.$CleaningLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CleaningLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CleaningLogFindUniqueOrThrowArgs} args - Arguments to find a CleaningLog
     * @example
     * // Get one CleaningLog
     * const cleaningLog = await prisma.cleaningLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CleaningLogFindUniqueOrThrowArgs>(args: SelectSubset<T, CleaningLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CleaningLogClient<$Result.GetResult<Prisma.$CleaningLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CleaningLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningLogFindFirstArgs} args - Arguments to find a CleaningLog
     * @example
     * // Get one CleaningLog
     * const cleaningLog = await prisma.cleaningLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CleaningLogFindFirstArgs>(args?: SelectSubset<T, CleaningLogFindFirstArgs<ExtArgs>>): Prisma__CleaningLogClient<$Result.GetResult<Prisma.$CleaningLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CleaningLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningLogFindFirstOrThrowArgs} args - Arguments to find a CleaningLog
     * @example
     * // Get one CleaningLog
     * const cleaningLog = await prisma.cleaningLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CleaningLogFindFirstOrThrowArgs>(args?: SelectSubset<T, CleaningLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__CleaningLogClient<$Result.GetResult<Prisma.$CleaningLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CleaningLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CleaningLogs
     * const cleaningLogs = await prisma.cleaningLog.findMany()
     * 
     * // Get first 10 CleaningLogs
     * const cleaningLogs = await prisma.cleaningLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cleaningLogWithIdOnly = await prisma.cleaningLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CleaningLogFindManyArgs>(args?: SelectSubset<T, CleaningLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CleaningLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CleaningLog.
     * @param {CleaningLogCreateArgs} args - Arguments to create a CleaningLog.
     * @example
     * // Create one CleaningLog
     * const CleaningLog = await prisma.cleaningLog.create({
     *   data: {
     *     // ... data to create a CleaningLog
     *   }
     * })
     * 
     */
    create<T extends CleaningLogCreateArgs>(args: SelectSubset<T, CleaningLogCreateArgs<ExtArgs>>): Prisma__CleaningLogClient<$Result.GetResult<Prisma.$CleaningLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CleaningLogs.
     * @param {CleaningLogCreateManyArgs} args - Arguments to create many CleaningLogs.
     * @example
     * // Create many CleaningLogs
     * const cleaningLog = await prisma.cleaningLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CleaningLogCreateManyArgs>(args?: SelectSubset<T, CleaningLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CleaningLogs and returns the data saved in the database.
     * @param {CleaningLogCreateManyAndReturnArgs} args - Arguments to create many CleaningLogs.
     * @example
     * // Create many CleaningLogs
     * const cleaningLog = await prisma.cleaningLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CleaningLogs and only return the `id`
     * const cleaningLogWithIdOnly = await prisma.cleaningLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CleaningLogCreateManyAndReturnArgs>(args?: SelectSubset<T, CleaningLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CleaningLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CleaningLog.
     * @param {CleaningLogDeleteArgs} args - Arguments to delete one CleaningLog.
     * @example
     * // Delete one CleaningLog
     * const CleaningLog = await prisma.cleaningLog.delete({
     *   where: {
     *     // ... filter to delete one CleaningLog
     *   }
     * })
     * 
     */
    delete<T extends CleaningLogDeleteArgs>(args: SelectSubset<T, CleaningLogDeleteArgs<ExtArgs>>): Prisma__CleaningLogClient<$Result.GetResult<Prisma.$CleaningLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CleaningLog.
     * @param {CleaningLogUpdateArgs} args - Arguments to update one CleaningLog.
     * @example
     * // Update one CleaningLog
     * const cleaningLog = await prisma.cleaningLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CleaningLogUpdateArgs>(args: SelectSubset<T, CleaningLogUpdateArgs<ExtArgs>>): Prisma__CleaningLogClient<$Result.GetResult<Prisma.$CleaningLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CleaningLogs.
     * @param {CleaningLogDeleteManyArgs} args - Arguments to filter CleaningLogs to delete.
     * @example
     * // Delete a few CleaningLogs
     * const { count } = await prisma.cleaningLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CleaningLogDeleteManyArgs>(args?: SelectSubset<T, CleaningLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CleaningLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CleaningLogs
     * const cleaningLog = await prisma.cleaningLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CleaningLogUpdateManyArgs>(args: SelectSubset<T, CleaningLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CleaningLog.
     * @param {CleaningLogUpsertArgs} args - Arguments to update or create a CleaningLog.
     * @example
     * // Update or create a CleaningLog
     * const cleaningLog = await prisma.cleaningLog.upsert({
     *   create: {
     *     // ... data to create a CleaningLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CleaningLog we want to update
     *   }
     * })
     */
    upsert<T extends CleaningLogUpsertArgs>(args: SelectSubset<T, CleaningLogUpsertArgs<ExtArgs>>): Prisma__CleaningLogClient<$Result.GetResult<Prisma.$CleaningLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CleaningLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningLogCountArgs} args - Arguments to filter CleaningLogs to count.
     * @example
     * // Count the number of CleaningLogs
     * const count = await prisma.cleaningLog.count({
     *   where: {
     *     // ... the filter for the CleaningLogs we want to count
     *   }
     * })
    **/
    count<T extends CleaningLogCountArgs>(
      args?: Subset<T, CleaningLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CleaningLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CleaningLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CleaningLogAggregateArgs>(args: Subset<T, CleaningLogAggregateArgs>): Prisma.PrismaPromise<GetCleaningLogAggregateType<T>>

    /**
     * Group by CleaningLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CleaningLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CleaningLogGroupByArgs['orderBy'] }
        : { orderBy?: CleaningLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CleaningLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCleaningLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CleaningLog model
   */
  readonly fields: CleaningLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CleaningLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CleaningLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clientProfile<T extends ClientProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientProfileDefaultArgs<ExtArgs>>): Prisma__ClientProfileClient<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    zones<T extends CleaningLog$zonesArgs<ExtArgs> = {}>(args?: Subset<T, CleaningLog$zonesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CleaningLogZonePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CleaningLog model
   */ 
  interface CleaningLogFieldRefs {
    readonly id: FieldRef<"CleaningLog", 'Int'>
    readonly personName: FieldRef<"CleaningLog", 'String'>
    readonly date: FieldRef<"CleaningLog", 'DateTime'>
    readonly clientProfileId: FieldRef<"CleaningLog", 'Int'>
    readonly createdAt: FieldRef<"CleaningLog", 'DateTime'>
    readonly updatedAt: FieldRef<"CleaningLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CleaningLog findUnique
   */
  export type CleaningLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLog
     */
    select?: CleaningLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogInclude<ExtArgs> | null
    /**
     * Filter, which CleaningLog to fetch.
     */
    where: CleaningLogWhereUniqueInput
  }

  /**
   * CleaningLog findUniqueOrThrow
   */
  export type CleaningLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLog
     */
    select?: CleaningLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogInclude<ExtArgs> | null
    /**
     * Filter, which CleaningLog to fetch.
     */
    where: CleaningLogWhereUniqueInput
  }

  /**
   * CleaningLog findFirst
   */
  export type CleaningLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLog
     */
    select?: CleaningLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogInclude<ExtArgs> | null
    /**
     * Filter, which CleaningLog to fetch.
     */
    where?: CleaningLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CleaningLogs to fetch.
     */
    orderBy?: CleaningLogOrderByWithRelationInput | CleaningLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CleaningLogs.
     */
    cursor?: CleaningLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CleaningLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CleaningLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CleaningLogs.
     */
    distinct?: CleaningLogScalarFieldEnum | CleaningLogScalarFieldEnum[]
  }

  /**
   * CleaningLog findFirstOrThrow
   */
  export type CleaningLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLog
     */
    select?: CleaningLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogInclude<ExtArgs> | null
    /**
     * Filter, which CleaningLog to fetch.
     */
    where?: CleaningLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CleaningLogs to fetch.
     */
    orderBy?: CleaningLogOrderByWithRelationInput | CleaningLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CleaningLogs.
     */
    cursor?: CleaningLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CleaningLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CleaningLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CleaningLogs.
     */
    distinct?: CleaningLogScalarFieldEnum | CleaningLogScalarFieldEnum[]
  }

  /**
   * CleaningLog findMany
   */
  export type CleaningLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLog
     */
    select?: CleaningLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogInclude<ExtArgs> | null
    /**
     * Filter, which CleaningLogs to fetch.
     */
    where?: CleaningLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CleaningLogs to fetch.
     */
    orderBy?: CleaningLogOrderByWithRelationInput | CleaningLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CleaningLogs.
     */
    cursor?: CleaningLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CleaningLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CleaningLogs.
     */
    skip?: number
    distinct?: CleaningLogScalarFieldEnum | CleaningLogScalarFieldEnum[]
  }

  /**
   * CleaningLog create
   */
  export type CleaningLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLog
     */
    select?: CleaningLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogInclude<ExtArgs> | null
    /**
     * The data needed to create a CleaningLog.
     */
    data: XOR<CleaningLogCreateInput, CleaningLogUncheckedCreateInput>
  }

  /**
   * CleaningLog createMany
   */
  export type CleaningLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CleaningLogs.
     */
    data: CleaningLogCreateManyInput | CleaningLogCreateManyInput[]
  }

  /**
   * CleaningLog createManyAndReturn
   */
  export type CleaningLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLog
     */
    select?: CleaningLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CleaningLogs.
     */
    data: CleaningLogCreateManyInput | CleaningLogCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CleaningLog update
   */
  export type CleaningLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLog
     */
    select?: CleaningLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogInclude<ExtArgs> | null
    /**
     * The data needed to update a CleaningLog.
     */
    data: XOR<CleaningLogUpdateInput, CleaningLogUncheckedUpdateInput>
    /**
     * Choose, which CleaningLog to update.
     */
    where: CleaningLogWhereUniqueInput
  }

  /**
   * CleaningLog updateMany
   */
  export type CleaningLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CleaningLogs.
     */
    data: XOR<CleaningLogUpdateManyMutationInput, CleaningLogUncheckedUpdateManyInput>
    /**
     * Filter which CleaningLogs to update
     */
    where?: CleaningLogWhereInput
  }

  /**
   * CleaningLog upsert
   */
  export type CleaningLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLog
     */
    select?: CleaningLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogInclude<ExtArgs> | null
    /**
     * The filter to search for the CleaningLog to update in case it exists.
     */
    where: CleaningLogWhereUniqueInput
    /**
     * In case the CleaningLog found by the `where` argument doesn't exist, create a new CleaningLog with this data.
     */
    create: XOR<CleaningLogCreateInput, CleaningLogUncheckedCreateInput>
    /**
     * In case the CleaningLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CleaningLogUpdateInput, CleaningLogUncheckedUpdateInput>
  }

  /**
   * CleaningLog delete
   */
  export type CleaningLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLog
     */
    select?: CleaningLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogInclude<ExtArgs> | null
    /**
     * Filter which CleaningLog to delete.
     */
    where: CleaningLogWhereUniqueInput
  }

  /**
   * CleaningLog deleteMany
   */
  export type CleaningLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CleaningLogs to delete
     */
    where?: CleaningLogWhereInput
  }

  /**
   * CleaningLog.zones
   */
  export type CleaningLog$zonesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLogZone
     */
    select?: CleaningLogZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogZoneInclude<ExtArgs> | null
    where?: CleaningLogZoneWhereInput
    orderBy?: CleaningLogZoneOrderByWithRelationInput | CleaningLogZoneOrderByWithRelationInput[]
    cursor?: CleaningLogZoneWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CleaningLogZoneScalarFieldEnum | CleaningLogZoneScalarFieldEnum[]
  }

  /**
   * CleaningLog without action
   */
  export type CleaningLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLog
     */
    select?: CleaningLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogInclude<ExtArgs> | null
  }


  /**
   * Model CleaningLogZone
   */

  export type AggregateCleaningLogZone = {
    _count: CleaningLogZoneCountAggregateOutputType | null
    _avg: CleaningLogZoneAvgAggregateOutputType | null
    _sum: CleaningLogZoneSumAggregateOutputType | null
    _min: CleaningLogZoneMinAggregateOutputType | null
    _max: CleaningLogZoneMaxAggregateOutputType | null
  }

  export type CleaningLogZoneAvgAggregateOutputType = {
    cleaningLogId: number | null
    cleaningZoneId: number | null
  }

  export type CleaningLogZoneSumAggregateOutputType = {
    cleaningLogId: number | null
    cleaningZoneId: number | null
  }

  export type CleaningLogZoneMinAggregateOutputType = {
    cleaningLogId: number | null
    cleaningZoneId: number | null
  }

  export type CleaningLogZoneMaxAggregateOutputType = {
    cleaningLogId: number | null
    cleaningZoneId: number | null
  }

  export type CleaningLogZoneCountAggregateOutputType = {
    cleaningLogId: number
    cleaningZoneId: number
    _all: number
  }


  export type CleaningLogZoneAvgAggregateInputType = {
    cleaningLogId?: true
    cleaningZoneId?: true
  }

  export type CleaningLogZoneSumAggregateInputType = {
    cleaningLogId?: true
    cleaningZoneId?: true
  }

  export type CleaningLogZoneMinAggregateInputType = {
    cleaningLogId?: true
    cleaningZoneId?: true
  }

  export type CleaningLogZoneMaxAggregateInputType = {
    cleaningLogId?: true
    cleaningZoneId?: true
  }

  export type CleaningLogZoneCountAggregateInputType = {
    cleaningLogId?: true
    cleaningZoneId?: true
    _all?: true
  }

  export type CleaningLogZoneAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CleaningLogZone to aggregate.
     */
    where?: CleaningLogZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CleaningLogZones to fetch.
     */
    orderBy?: CleaningLogZoneOrderByWithRelationInput | CleaningLogZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CleaningLogZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CleaningLogZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CleaningLogZones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CleaningLogZones
    **/
    _count?: true | CleaningLogZoneCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CleaningLogZoneAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CleaningLogZoneSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CleaningLogZoneMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CleaningLogZoneMaxAggregateInputType
  }

  export type GetCleaningLogZoneAggregateType<T extends CleaningLogZoneAggregateArgs> = {
        [P in keyof T & keyof AggregateCleaningLogZone]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCleaningLogZone[P]>
      : GetScalarType<T[P], AggregateCleaningLogZone[P]>
  }




  export type CleaningLogZoneGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CleaningLogZoneWhereInput
    orderBy?: CleaningLogZoneOrderByWithAggregationInput | CleaningLogZoneOrderByWithAggregationInput[]
    by: CleaningLogZoneScalarFieldEnum[] | CleaningLogZoneScalarFieldEnum
    having?: CleaningLogZoneScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CleaningLogZoneCountAggregateInputType | true
    _avg?: CleaningLogZoneAvgAggregateInputType
    _sum?: CleaningLogZoneSumAggregateInputType
    _min?: CleaningLogZoneMinAggregateInputType
    _max?: CleaningLogZoneMaxAggregateInputType
  }

  export type CleaningLogZoneGroupByOutputType = {
    cleaningLogId: number
    cleaningZoneId: number
    _count: CleaningLogZoneCountAggregateOutputType | null
    _avg: CleaningLogZoneAvgAggregateOutputType | null
    _sum: CleaningLogZoneSumAggregateOutputType | null
    _min: CleaningLogZoneMinAggregateOutputType | null
    _max: CleaningLogZoneMaxAggregateOutputType | null
  }

  type GetCleaningLogZoneGroupByPayload<T extends CleaningLogZoneGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CleaningLogZoneGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CleaningLogZoneGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CleaningLogZoneGroupByOutputType[P]>
            : GetScalarType<T[P], CleaningLogZoneGroupByOutputType[P]>
        }
      >
    >


  export type CleaningLogZoneSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    cleaningLogId?: boolean
    cleaningZoneId?: boolean
    cleaningLog?: boolean | CleaningLogDefaultArgs<ExtArgs>
    cleaningZone?: boolean | CleaningZoneDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cleaningLogZone"]>

  export type CleaningLogZoneSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    cleaningLogId?: boolean
    cleaningZoneId?: boolean
    cleaningLog?: boolean | CleaningLogDefaultArgs<ExtArgs>
    cleaningZone?: boolean | CleaningZoneDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cleaningLogZone"]>

  export type CleaningLogZoneSelectScalar = {
    cleaningLogId?: boolean
    cleaningZoneId?: boolean
  }

  export type CleaningLogZoneInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cleaningLog?: boolean | CleaningLogDefaultArgs<ExtArgs>
    cleaningZone?: boolean | CleaningZoneDefaultArgs<ExtArgs>
  }
  export type CleaningLogZoneIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cleaningLog?: boolean | CleaningLogDefaultArgs<ExtArgs>
    cleaningZone?: boolean | CleaningZoneDefaultArgs<ExtArgs>
  }

  export type $CleaningLogZonePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CleaningLogZone"
    objects: {
      cleaningLog: Prisma.$CleaningLogPayload<ExtArgs>
      cleaningZone: Prisma.$CleaningZonePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      cleaningLogId: number
      cleaningZoneId: number
    }, ExtArgs["result"]["cleaningLogZone"]>
    composites: {}
  }

  type CleaningLogZoneGetPayload<S extends boolean | null | undefined | CleaningLogZoneDefaultArgs> = $Result.GetResult<Prisma.$CleaningLogZonePayload, S>

  type CleaningLogZoneCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CleaningLogZoneFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CleaningLogZoneCountAggregateInputType | true
    }

  export interface CleaningLogZoneDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CleaningLogZone'], meta: { name: 'CleaningLogZone' } }
    /**
     * Find zero or one CleaningLogZone that matches the filter.
     * @param {CleaningLogZoneFindUniqueArgs} args - Arguments to find a CleaningLogZone
     * @example
     * // Get one CleaningLogZone
     * const cleaningLogZone = await prisma.cleaningLogZone.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CleaningLogZoneFindUniqueArgs>(args: SelectSubset<T, CleaningLogZoneFindUniqueArgs<ExtArgs>>): Prisma__CleaningLogZoneClient<$Result.GetResult<Prisma.$CleaningLogZonePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CleaningLogZone that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CleaningLogZoneFindUniqueOrThrowArgs} args - Arguments to find a CleaningLogZone
     * @example
     * // Get one CleaningLogZone
     * const cleaningLogZone = await prisma.cleaningLogZone.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CleaningLogZoneFindUniqueOrThrowArgs>(args: SelectSubset<T, CleaningLogZoneFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CleaningLogZoneClient<$Result.GetResult<Prisma.$CleaningLogZonePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CleaningLogZone that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningLogZoneFindFirstArgs} args - Arguments to find a CleaningLogZone
     * @example
     * // Get one CleaningLogZone
     * const cleaningLogZone = await prisma.cleaningLogZone.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CleaningLogZoneFindFirstArgs>(args?: SelectSubset<T, CleaningLogZoneFindFirstArgs<ExtArgs>>): Prisma__CleaningLogZoneClient<$Result.GetResult<Prisma.$CleaningLogZonePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CleaningLogZone that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningLogZoneFindFirstOrThrowArgs} args - Arguments to find a CleaningLogZone
     * @example
     * // Get one CleaningLogZone
     * const cleaningLogZone = await prisma.cleaningLogZone.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CleaningLogZoneFindFirstOrThrowArgs>(args?: SelectSubset<T, CleaningLogZoneFindFirstOrThrowArgs<ExtArgs>>): Prisma__CleaningLogZoneClient<$Result.GetResult<Prisma.$CleaningLogZonePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CleaningLogZones that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningLogZoneFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CleaningLogZones
     * const cleaningLogZones = await prisma.cleaningLogZone.findMany()
     * 
     * // Get first 10 CleaningLogZones
     * const cleaningLogZones = await prisma.cleaningLogZone.findMany({ take: 10 })
     * 
     * // Only select the `cleaningLogId`
     * const cleaningLogZoneWithCleaningLogIdOnly = await prisma.cleaningLogZone.findMany({ select: { cleaningLogId: true } })
     * 
     */
    findMany<T extends CleaningLogZoneFindManyArgs>(args?: SelectSubset<T, CleaningLogZoneFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CleaningLogZonePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CleaningLogZone.
     * @param {CleaningLogZoneCreateArgs} args - Arguments to create a CleaningLogZone.
     * @example
     * // Create one CleaningLogZone
     * const CleaningLogZone = await prisma.cleaningLogZone.create({
     *   data: {
     *     // ... data to create a CleaningLogZone
     *   }
     * })
     * 
     */
    create<T extends CleaningLogZoneCreateArgs>(args: SelectSubset<T, CleaningLogZoneCreateArgs<ExtArgs>>): Prisma__CleaningLogZoneClient<$Result.GetResult<Prisma.$CleaningLogZonePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CleaningLogZones.
     * @param {CleaningLogZoneCreateManyArgs} args - Arguments to create many CleaningLogZones.
     * @example
     * // Create many CleaningLogZones
     * const cleaningLogZone = await prisma.cleaningLogZone.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CleaningLogZoneCreateManyArgs>(args?: SelectSubset<T, CleaningLogZoneCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CleaningLogZones and returns the data saved in the database.
     * @param {CleaningLogZoneCreateManyAndReturnArgs} args - Arguments to create many CleaningLogZones.
     * @example
     * // Create many CleaningLogZones
     * const cleaningLogZone = await prisma.cleaningLogZone.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CleaningLogZones and only return the `cleaningLogId`
     * const cleaningLogZoneWithCleaningLogIdOnly = await prisma.cleaningLogZone.createManyAndReturn({ 
     *   select: { cleaningLogId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CleaningLogZoneCreateManyAndReturnArgs>(args?: SelectSubset<T, CleaningLogZoneCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CleaningLogZonePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CleaningLogZone.
     * @param {CleaningLogZoneDeleteArgs} args - Arguments to delete one CleaningLogZone.
     * @example
     * // Delete one CleaningLogZone
     * const CleaningLogZone = await prisma.cleaningLogZone.delete({
     *   where: {
     *     // ... filter to delete one CleaningLogZone
     *   }
     * })
     * 
     */
    delete<T extends CleaningLogZoneDeleteArgs>(args: SelectSubset<T, CleaningLogZoneDeleteArgs<ExtArgs>>): Prisma__CleaningLogZoneClient<$Result.GetResult<Prisma.$CleaningLogZonePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CleaningLogZone.
     * @param {CleaningLogZoneUpdateArgs} args - Arguments to update one CleaningLogZone.
     * @example
     * // Update one CleaningLogZone
     * const cleaningLogZone = await prisma.cleaningLogZone.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CleaningLogZoneUpdateArgs>(args: SelectSubset<T, CleaningLogZoneUpdateArgs<ExtArgs>>): Prisma__CleaningLogZoneClient<$Result.GetResult<Prisma.$CleaningLogZonePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CleaningLogZones.
     * @param {CleaningLogZoneDeleteManyArgs} args - Arguments to filter CleaningLogZones to delete.
     * @example
     * // Delete a few CleaningLogZones
     * const { count } = await prisma.cleaningLogZone.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CleaningLogZoneDeleteManyArgs>(args?: SelectSubset<T, CleaningLogZoneDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CleaningLogZones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningLogZoneUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CleaningLogZones
     * const cleaningLogZone = await prisma.cleaningLogZone.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CleaningLogZoneUpdateManyArgs>(args: SelectSubset<T, CleaningLogZoneUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CleaningLogZone.
     * @param {CleaningLogZoneUpsertArgs} args - Arguments to update or create a CleaningLogZone.
     * @example
     * // Update or create a CleaningLogZone
     * const cleaningLogZone = await prisma.cleaningLogZone.upsert({
     *   create: {
     *     // ... data to create a CleaningLogZone
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CleaningLogZone we want to update
     *   }
     * })
     */
    upsert<T extends CleaningLogZoneUpsertArgs>(args: SelectSubset<T, CleaningLogZoneUpsertArgs<ExtArgs>>): Prisma__CleaningLogZoneClient<$Result.GetResult<Prisma.$CleaningLogZonePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CleaningLogZones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningLogZoneCountArgs} args - Arguments to filter CleaningLogZones to count.
     * @example
     * // Count the number of CleaningLogZones
     * const count = await prisma.cleaningLogZone.count({
     *   where: {
     *     // ... the filter for the CleaningLogZones we want to count
     *   }
     * })
    **/
    count<T extends CleaningLogZoneCountArgs>(
      args?: Subset<T, CleaningLogZoneCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CleaningLogZoneCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CleaningLogZone.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningLogZoneAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CleaningLogZoneAggregateArgs>(args: Subset<T, CleaningLogZoneAggregateArgs>): Prisma.PrismaPromise<GetCleaningLogZoneAggregateType<T>>

    /**
     * Group by CleaningLogZone.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CleaningLogZoneGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CleaningLogZoneGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CleaningLogZoneGroupByArgs['orderBy'] }
        : { orderBy?: CleaningLogZoneGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CleaningLogZoneGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCleaningLogZoneGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CleaningLogZone model
   */
  readonly fields: CleaningLogZoneFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CleaningLogZone.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CleaningLogZoneClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cleaningLog<T extends CleaningLogDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CleaningLogDefaultArgs<ExtArgs>>): Prisma__CleaningLogClient<$Result.GetResult<Prisma.$CleaningLogPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    cleaningZone<T extends CleaningZoneDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CleaningZoneDefaultArgs<ExtArgs>>): Prisma__CleaningZoneClient<$Result.GetResult<Prisma.$CleaningZonePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CleaningLogZone model
   */ 
  interface CleaningLogZoneFieldRefs {
    readonly cleaningLogId: FieldRef<"CleaningLogZone", 'Int'>
    readonly cleaningZoneId: FieldRef<"CleaningLogZone", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * CleaningLogZone findUnique
   */
  export type CleaningLogZoneFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLogZone
     */
    select?: CleaningLogZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogZoneInclude<ExtArgs> | null
    /**
     * Filter, which CleaningLogZone to fetch.
     */
    where: CleaningLogZoneWhereUniqueInput
  }

  /**
   * CleaningLogZone findUniqueOrThrow
   */
  export type CleaningLogZoneFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLogZone
     */
    select?: CleaningLogZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogZoneInclude<ExtArgs> | null
    /**
     * Filter, which CleaningLogZone to fetch.
     */
    where: CleaningLogZoneWhereUniqueInput
  }

  /**
   * CleaningLogZone findFirst
   */
  export type CleaningLogZoneFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLogZone
     */
    select?: CleaningLogZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogZoneInclude<ExtArgs> | null
    /**
     * Filter, which CleaningLogZone to fetch.
     */
    where?: CleaningLogZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CleaningLogZones to fetch.
     */
    orderBy?: CleaningLogZoneOrderByWithRelationInput | CleaningLogZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CleaningLogZones.
     */
    cursor?: CleaningLogZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CleaningLogZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CleaningLogZones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CleaningLogZones.
     */
    distinct?: CleaningLogZoneScalarFieldEnum | CleaningLogZoneScalarFieldEnum[]
  }

  /**
   * CleaningLogZone findFirstOrThrow
   */
  export type CleaningLogZoneFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLogZone
     */
    select?: CleaningLogZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogZoneInclude<ExtArgs> | null
    /**
     * Filter, which CleaningLogZone to fetch.
     */
    where?: CleaningLogZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CleaningLogZones to fetch.
     */
    orderBy?: CleaningLogZoneOrderByWithRelationInput | CleaningLogZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CleaningLogZones.
     */
    cursor?: CleaningLogZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CleaningLogZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CleaningLogZones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CleaningLogZones.
     */
    distinct?: CleaningLogZoneScalarFieldEnum | CleaningLogZoneScalarFieldEnum[]
  }

  /**
   * CleaningLogZone findMany
   */
  export type CleaningLogZoneFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLogZone
     */
    select?: CleaningLogZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogZoneInclude<ExtArgs> | null
    /**
     * Filter, which CleaningLogZones to fetch.
     */
    where?: CleaningLogZoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CleaningLogZones to fetch.
     */
    orderBy?: CleaningLogZoneOrderByWithRelationInput | CleaningLogZoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CleaningLogZones.
     */
    cursor?: CleaningLogZoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CleaningLogZones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CleaningLogZones.
     */
    skip?: number
    distinct?: CleaningLogZoneScalarFieldEnum | CleaningLogZoneScalarFieldEnum[]
  }

  /**
   * CleaningLogZone create
   */
  export type CleaningLogZoneCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLogZone
     */
    select?: CleaningLogZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogZoneInclude<ExtArgs> | null
    /**
     * The data needed to create a CleaningLogZone.
     */
    data: XOR<CleaningLogZoneCreateInput, CleaningLogZoneUncheckedCreateInput>
  }

  /**
   * CleaningLogZone createMany
   */
  export type CleaningLogZoneCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CleaningLogZones.
     */
    data: CleaningLogZoneCreateManyInput | CleaningLogZoneCreateManyInput[]
  }

  /**
   * CleaningLogZone createManyAndReturn
   */
  export type CleaningLogZoneCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLogZone
     */
    select?: CleaningLogZoneSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CleaningLogZones.
     */
    data: CleaningLogZoneCreateManyInput | CleaningLogZoneCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogZoneIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CleaningLogZone update
   */
  export type CleaningLogZoneUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLogZone
     */
    select?: CleaningLogZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogZoneInclude<ExtArgs> | null
    /**
     * The data needed to update a CleaningLogZone.
     */
    data: XOR<CleaningLogZoneUpdateInput, CleaningLogZoneUncheckedUpdateInput>
    /**
     * Choose, which CleaningLogZone to update.
     */
    where: CleaningLogZoneWhereUniqueInput
  }

  /**
   * CleaningLogZone updateMany
   */
  export type CleaningLogZoneUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CleaningLogZones.
     */
    data: XOR<CleaningLogZoneUpdateManyMutationInput, CleaningLogZoneUncheckedUpdateManyInput>
    /**
     * Filter which CleaningLogZones to update
     */
    where?: CleaningLogZoneWhereInput
  }

  /**
   * CleaningLogZone upsert
   */
  export type CleaningLogZoneUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLogZone
     */
    select?: CleaningLogZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogZoneInclude<ExtArgs> | null
    /**
     * The filter to search for the CleaningLogZone to update in case it exists.
     */
    where: CleaningLogZoneWhereUniqueInput
    /**
     * In case the CleaningLogZone found by the `where` argument doesn't exist, create a new CleaningLogZone with this data.
     */
    create: XOR<CleaningLogZoneCreateInput, CleaningLogZoneUncheckedCreateInput>
    /**
     * In case the CleaningLogZone was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CleaningLogZoneUpdateInput, CleaningLogZoneUncheckedUpdateInput>
  }

  /**
   * CleaningLogZone delete
   */
  export type CleaningLogZoneDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLogZone
     */
    select?: CleaningLogZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogZoneInclude<ExtArgs> | null
    /**
     * Filter which CleaningLogZone to delete.
     */
    where: CleaningLogZoneWhereUniqueInput
  }

  /**
   * CleaningLogZone deleteMany
   */
  export type CleaningLogZoneDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CleaningLogZones to delete
     */
    where?: CleaningLogZoneWhereInput
  }

  /**
   * CleaningLogZone without action
   */
  export type CleaningLogZoneDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CleaningLogZone
     */
    select?: CleaningLogZoneSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CleaningLogZoneInclude<ExtArgs> | null
  }


  /**
   * Model Chamber
   */

  export type AggregateChamber = {
    _count: ChamberCountAggregateOutputType | null
    _avg: ChamberAvgAggregateOutputType | null
    _sum: ChamberSumAggregateOutputType | null
    _min: ChamberMinAggregateOutputType | null
    _max: ChamberMaxAggregateOutputType | null
  }

  export type ChamberAvgAggregateOutputType = {
    id: number | null
    clientProfileId: number | null
  }

  export type ChamberSumAggregateOutputType = {
    id: number | null
    clientProfileId: number | null
  }

  export type ChamberMinAggregateOutputType = {
    id: number | null
    name: string | null
    clientProfileId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChamberMaxAggregateOutputType = {
    id: number | null
    name: string | null
    clientProfileId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChamberCountAggregateOutputType = {
    id: number
    name: number
    clientProfileId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChamberAvgAggregateInputType = {
    id?: true
    clientProfileId?: true
  }

  export type ChamberSumAggregateInputType = {
    id?: true
    clientProfileId?: true
  }

  export type ChamberMinAggregateInputType = {
    id?: true
    name?: true
    clientProfileId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChamberMaxAggregateInputType = {
    id?: true
    name?: true
    clientProfileId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChamberCountAggregateInputType = {
    id?: true
    name?: true
    clientProfileId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChamberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Chamber to aggregate.
     */
    where?: ChamberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chambers to fetch.
     */
    orderBy?: ChamberOrderByWithRelationInput | ChamberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChamberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chambers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chambers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Chambers
    **/
    _count?: true | ChamberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChamberAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChamberSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChamberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChamberMaxAggregateInputType
  }

  export type GetChamberAggregateType<T extends ChamberAggregateArgs> = {
        [P in keyof T & keyof AggregateChamber]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChamber[P]>
      : GetScalarType<T[P], AggregateChamber[P]>
  }




  export type ChamberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChamberWhereInput
    orderBy?: ChamberOrderByWithAggregationInput | ChamberOrderByWithAggregationInput[]
    by: ChamberScalarFieldEnum[] | ChamberScalarFieldEnum
    having?: ChamberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChamberCountAggregateInputType | true
    _avg?: ChamberAvgAggregateInputType
    _sum?: ChamberSumAggregateInputType
    _min?: ChamberMinAggregateInputType
    _max?: ChamberMaxAggregateInputType
  }

  export type ChamberGroupByOutputType = {
    id: number
    name: string
    clientProfileId: number
    createdAt: Date
    updatedAt: Date
    _count: ChamberCountAggregateOutputType | null
    _avg: ChamberAvgAggregateOutputType | null
    _sum: ChamberSumAggregateOutputType | null
    _min: ChamberMinAggregateOutputType | null
    _max: ChamberMaxAggregateOutputType | null
  }

  type GetChamberGroupByPayload<T extends ChamberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChamberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChamberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChamberGroupByOutputType[P]>
            : GetScalarType<T[P], ChamberGroupByOutputType[P]>
        }
      >
    >


  export type ChamberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    clientProfileId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
    values?: boolean | Chamber$valuesArgs<ExtArgs>
    _count?: boolean | ChamberCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chamber"]>

  export type ChamberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    clientProfileId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chamber"]>

  export type ChamberSelectScalar = {
    id?: boolean
    name?: boolean
    clientProfileId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChamberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
    values?: boolean | Chamber$valuesArgs<ExtArgs>
    _count?: boolean | ChamberCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChamberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
  }

  export type $ChamberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Chamber"
    objects: {
      clientProfile: Prisma.$ClientProfilePayload<ExtArgs>
      values: Prisma.$TemperatureValuePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      clientProfileId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["chamber"]>
    composites: {}
  }

  type ChamberGetPayload<S extends boolean | null | undefined | ChamberDefaultArgs> = $Result.GetResult<Prisma.$ChamberPayload, S>

  type ChamberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ChamberFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ChamberCountAggregateInputType | true
    }

  export interface ChamberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Chamber'], meta: { name: 'Chamber' } }
    /**
     * Find zero or one Chamber that matches the filter.
     * @param {ChamberFindUniqueArgs} args - Arguments to find a Chamber
     * @example
     * // Get one Chamber
     * const chamber = await prisma.chamber.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChamberFindUniqueArgs>(args: SelectSubset<T, ChamberFindUniqueArgs<ExtArgs>>): Prisma__ChamberClient<$Result.GetResult<Prisma.$ChamberPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Chamber that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ChamberFindUniqueOrThrowArgs} args - Arguments to find a Chamber
     * @example
     * // Get one Chamber
     * const chamber = await prisma.chamber.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChamberFindUniqueOrThrowArgs>(args: SelectSubset<T, ChamberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChamberClient<$Result.GetResult<Prisma.$ChamberPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Chamber that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChamberFindFirstArgs} args - Arguments to find a Chamber
     * @example
     * // Get one Chamber
     * const chamber = await prisma.chamber.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChamberFindFirstArgs>(args?: SelectSubset<T, ChamberFindFirstArgs<ExtArgs>>): Prisma__ChamberClient<$Result.GetResult<Prisma.$ChamberPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Chamber that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChamberFindFirstOrThrowArgs} args - Arguments to find a Chamber
     * @example
     * // Get one Chamber
     * const chamber = await prisma.chamber.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChamberFindFirstOrThrowArgs>(args?: SelectSubset<T, ChamberFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChamberClient<$Result.GetResult<Prisma.$ChamberPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Chambers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChamberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Chambers
     * const chambers = await prisma.chamber.findMany()
     * 
     * // Get first 10 Chambers
     * const chambers = await prisma.chamber.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chamberWithIdOnly = await prisma.chamber.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChamberFindManyArgs>(args?: SelectSubset<T, ChamberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChamberPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Chamber.
     * @param {ChamberCreateArgs} args - Arguments to create a Chamber.
     * @example
     * // Create one Chamber
     * const Chamber = await prisma.chamber.create({
     *   data: {
     *     // ... data to create a Chamber
     *   }
     * })
     * 
     */
    create<T extends ChamberCreateArgs>(args: SelectSubset<T, ChamberCreateArgs<ExtArgs>>): Prisma__ChamberClient<$Result.GetResult<Prisma.$ChamberPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Chambers.
     * @param {ChamberCreateManyArgs} args - Arguments to create many Chambers.
     * @example
     * // Create many Chambers
     * const chamber = await prisma.chamber.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChamberCreateManyArgs>(args?: SelectSubset<T, ChamberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Chambers and returns the data saved in the database.
     * @param {ChamberCreateManyAndReturnArgs} args - Arguments to create many Chambers.
     * @example
     * // Create many Chambers
     * const chamber = await prisma.chamber.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Chambers and only return the `id`
     * const chamberWithIdOnly = await prisma.chamber.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChamberCreateManyAndReturnArgs>(args?: SelectSubset<T, ChamberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChamberPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Chamber.
     * @param {ChamberDeleteArgs} args - Arguments to delete one Chamber.
     * @example
     * // Delete one Chamber
     * const Chamber = await prisma.chamber.delete({
     *   where: {
     *     // ... filter to delete one Chamber
     *   }
     * })
     * 
     */
    delete<T extends ChamberDeleteArgs>(args: SelectSubset<T, ChamberDeleteArgs<ExtArgs>>): Prisma__ChamberClient<$Result.GetResult<Prisma.$ChamberPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Chamber.
     * @param {ChamberUpdateArgs} args - Arguments to update one Chamber.
     * @example
     * // Update one Chamber
     * const chamber = await prisma.chamber.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChamberUpdateArgs>(args: SelectSubset<T, ChamberUpdateArgs<ExtArgs>>): Prisma__ChamberClient<$Result.GetResult<Prisma.$ChamberPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Chambers.
     * @param {ChamberDeleteManyArgs} args - Arguments to filter Chambers to delete.
     * @example
     * // Delete a few Chambers
     * const { count } = await prisma.chamber.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChamberDeleteManyArgs>(args?: SelectSubset<T, ChamberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Chambers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChamberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Chambers
     * const chamber = await prisma.chamber.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChamberUpdateManyArgs>(args: SelectSubset<T, ChamberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Chamber.
     * @param {ChamberUpsertArgs} args - Arguments to update or create a Chamber.
     * @example
     * // Update or create a Chamber
     * const chamber = await prisma.chamber.upsert({
     *   create: {
     *     // ... data to create a Chamber
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Chamber we want to update
     *   }
     * })
     */
    upsert<T extends ChamberUpsertArgs>(args: SelectSubset<T, ChamberUpsertArgs<ExtArgs>>): Prisma__ChamberClient<$Result.GetResult<Prisma.$ChamberPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Chambers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChamberCountArgs} args - Arguments to filter Chambers to count.
     * @example
     * // Count the number of Chambers
     * const count = await prisma.chamber.count({
     *   where: {
     *     // ... the filter for the Chambers we want to count
     *   }
     * })
    **/
    count<T extends ChamberCountArgs>(
      args?: Subset<T, ChamberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChamberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Chamber.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChamberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChamberAggregateArgs>(args: Subset<T, ChamberAggregateArgs>): Prisma.PrismaPromise<GetChamberAggregateType<T>>

    /**
     * Group by Chamber.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChamberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChamberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChamberGroupByArgs['orderBy'] }
        : { orderBy?: ChamberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChamberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChamberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Chamber model
   */
  readonly fields: ChamberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Chamber.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChamberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clientProfile<T extends ClientProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientProfileDefaultArgs<ExtArgs>>): Prisma__ClientProfileClient<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    values<T extends Chamber$valuesArgs<ExtArgs> = {}>(args?: Subset<T, Chamber$valuesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemperatureValuePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Chamber model
   */ 
  interface ChamberFieldRefs {
    readonly id: FieldRef<"Chamber", 'Int'>
    readonly name: FieldRef<"Chamber", 'String'>
    readonly clientProfileId: FieldRef<"Chamber", 'Int'>
    readonly createdAt: FieldRef<"Chamber", 'DateTime'>
    readonly updatedAt: FieldRef<"Chamber", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Chamber findUnique
   */
  export type ChamberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chamber
     */
    select?: ChamberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamberInclude<ExtArgs> | null
    /**
     * Filter, which Chamber to fetch.
     */
    where: ChamberWhereUniqueInput
  }

  /**
   * Chamber findUniqueOrThrow
   */
  export type ChamberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chamber
     */
    select?: ChamberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamberInclude<ExtArgs> | null
    /**
     * Filter, which Chamber to fetch.
     */
    where: ChamberWhereUniqueInput
  }

  /**
   * Chamber findFirst
   */
  export type ChamberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chamber
     */
    select?: ChamberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamberInclude<ExtArgs> | null
    /**
     * Filter, which Chamber to fetch.
     */
    where?: ChamberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chambers to fetch.
     */
    orderBy?: ChamberOrderByWithRelationInput | ChamberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Chambers.
     */
    cursor?: ChamberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chambers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chambers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Chambers.
     */
    distinct?: ChamberScalarFieldEnum | ChamberScalarFieldEnum[]
  }

  /**
   * Chamber findFirstOrThrow
   */
  export type ChamberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chamber
     */
    select?: ChamberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamberInclude<ExtArgs> | null
    /**
     * Filter, which Chamber to fetch.
     */
    where?: ChamberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chambers to fetch.
     */
    orderBy?: ChamberOrderByWithRelationInput | ChamberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Chambers.
     */
    cursor?: ChamberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chambers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chambers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Chambers.
     */
    distinct?: ChamberScalarFieldEnum | ChamberScalarFieldEnum[]
  }

  /**
   * Chamber findMany
   */
  export type ChamberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chamber
     */
    select?: ChamberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamberInclude<ExtArgs> | null
    /**
     * Filter, which Chambers to fetch.
     */
    where?: ChamberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Chambers to fetch.
     */
    orderBy?: ChamberOrderByWithRelationInput | ChamberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Chambers.
     */
    cursor?: ChamberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Chambers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Chambers.
     */
    skip?: number
    distinct?: ChamberScalarFieldEnum | ChamberScalarFieldEnum[]
  }

  /**
   * Chamber create
   */
  export type ChamberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chamber
     */
    select?: ChamberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamberInclude<ExtArgs> | null
    /**
     * The data needed to create a Chamber.
     */
    data: XOR<ChamberCreateInput, ChamberUncheckedCreateInput>
  }

  /**
   * Chamber createMany
   */
  export type ChamberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Chambers.
     */
    data: ChamberCreateManyInput | ChamberCreateManyInput[]
  }

  /**
   * Chamber createManyAndReturn
   */
  export type ChamberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chamber
     */
    select?: ChamberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Chambers.
     */
    data: ChamberCreateManyInput | ChamberCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Chamber update
   */
  export type ChamberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chamber
     */
    select?: ChamberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamberInclude<ExtArgs> | null
    /**
     * The data needed to update a Chamber.
     */
    data: XOR<ChamberUpdateInput, ChamberUncheckedUpdateInput>
    /**
     * Choose, which Chamber to update.
     */
    where: ChamberWhereUniqueInput
  }

  /**
   * Chamber updateMany
   */
  export type ChamberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Chambers.
     */
    data: XOR<ChamberUpdateManyMutationInput, ChamberUncheckedUpdateManyInput>
    /**
     * Filter which Chambers to update
     */
    where?: ChamberWhereInput
  }

  /**
   * Chamber upsert
   */
  export type ChamberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chamber
     */
    select?: ChamberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamberInclude<ExtArgs> | null
    /**
     * The filter to search for the Chamber to update in case it exists.
     */
    where: ChamberWhereUniqueInput
    /**
     * In case the Chamber found by the `where` argument doesn't exist, create a new Chamber with this data.
     */
    create: XOR<ChamberCreateInput, ChamberUncheckedCreateInput>
    /**
     * In case the Chamber was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChamberUpdateInput, ChamberUncheckedUpdateInput>
  }

  /**
   * Chamber delete
   */
  export type ChamberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chamber
     */
    select?: ChamberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamberInclude<ExtArgs> | null
    /**
     * Filter which Chamber to delete.
     */
    where: ChamberWhereUniqueInput
  }

  /**
   * Chamber deleteMany
   */
  export type ChamberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Chambers to delete
     */
    where?: ChamberWhereInput
  }

  /**
   * Chamber.values
   */
  export type Chamber$valuesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureValue
     */
    select?: TemperatureValueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureValueInclude<ExtArgs> | null
    where?: TemperatureValueWhereInput
    orderBy?: TemperatureValueOrderByWithRelationInput | TemperatureValueOrderByWithRelationInput[]
    cursor?: TemperatureValueWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TemperatureValueScalarFieldEnum | TemperatureValueScalarFieldEnum[]
  }

  /**
   * Chamber without action
   */
  export type ChamberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Chamber
     */
    select?: ChamberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChamberInclude<ExtArgs> | null
  }


  /**
   * Model TemperatureRecord
   */

  export type AggregateTemperatureRecord = {
    _count: TemperatureRecordCountAggregateOutputType | null
    _avg: TemperatureRecordAvgAggregateOutputType | null
    _sum: TemperatureRecordSumAggregateOutputType | null
    _min: TemperatureRecordMinAggregateOutputType | null
    _max: TemperatureRecordMaxAggregateOutputType | null
  }

  export type TemperatureRecordAvgAggregateOutputType = {
    id: number | null
    clientProfileId: number | null
  }

  export type TemperatureRecordSumAggregateOutputType = {
    id: number | null
    clientProfileId: number | null
  }

  export type TemperatureRecordMinAggregateOutputType = {
    id: number | null
    date: Date | null
    clientProfileId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TemperatureRecordMaxAggregateOutputType = {
    id: number | null
    date: Date | null
    clientProfileId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TemperatureRecordCountAggregateOutputType = {
    id: number
    date: number
    clientProfileId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TemperatureRecordAvgAggregateInputType = {
    id?: true
    clientProfileId?: true
  }

  export type TemperatureRecordSumAggregateInputType = {
    id?: true
    clientProfileId?: true
  }

  export type TemperatureRecordMinAggregateInputType = {
    id?: true
    date?: true
    clientProfileId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TemperatureRecordMaxAggregateInputType = {
    id?: true
    date?: true
    clientProfileId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TemperatureRecordCountAggregateInputType = {
    id?: true
    date?: true
    clientProfileId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TemperatureRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TemperatureRecord to aggregate.
     */
    where?: TemperatureRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemperatureRecords to fetch.
     */
    orderBy?: TemperatureRecordOrderByWithRelationInput | TemperatureRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TemperatureRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemperatureRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemperatureRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TemperatureRecords
    **/
    _count?: true | TemperatureRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TemperatureRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TemperatureRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TemperatureRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TemperatureRecordMaxAggregateInputType
  }

  export type GetTemperatureRecordAggregateType<T extends TemperatureRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateTemperatureRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTemperatureRecord[P]>
      : GetScalarType<T[P], AggregateTemperatureRecord[P]>
  }




  export type TemperatureRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemperatureRecordWhereInput
    orderBy?: TemperatureRecordOrderByWithAggregationInput | TemperatureRecordOrderByWithAggregationInput[]
    by: TemperatureRecordScalarFieldEnum[] | TemperatureRecordScalarFieldEnum
    having?: TemperatureRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TemperatureRecordCountAggregateInputType | true
    _avg?: TemperatureRecordAvgAggregateInputType
    _sum?: TemperatureRecordSumAggregateInputType
    _min?: TemperatureRecordMinAggregateInputType
    _max?: TemperatureRecordMaxAggregateInputType
  }

  export type TemperatureRecordGroupByOutputType = {
    id: number
    date: Date
    clientProfileId: number
    createdAt: Date
    updatedAt: Date
    _count: TemperatureRecordCountAggregateOutputType | null
    _avg: TemperatureRecordAvgAggregateOutputType | null
    _sum: TemperatureRecordSumAggregateOutputType | null
    _min: TemperatureRecordMinAggregateOutputType | null
    _max: TemperatureRecordMaxAggregateOutputType | null
  }

  type GetTemperatureRecordGroupByPayload<T extends TemperatureRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TemperatureRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TemperatureRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TemperatureRecordGroupByOutputType[P]>
            : GetScalarType<T[P], TemperatureRecordGroupByOutputType[P]>
        }
      >
    >


  export type TemperatureRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    clientProfileId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
    values?: boolean | TemperatureRecord$valuesArgs<ExtArgs>
    _count?: boolean | TemperatureRecordCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["temperatureRecord"]>

  export type TemperatureRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    clientProfileId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["temperatureRecord"]>

  export type TemperatureRecordSelectScalar = {
    id?: boolean
    date?: boolean
    clientProfileId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TemperatureRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
    values?: boolean | TemperatureRecord$valuesArgs<ExtArgs>
    _count?: boolean | TemperatureRecordCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TemperatureRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
  }

  export type $TemperatureRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TemperatureRecord"
    objects: {
      clientProfile: Prisma.$ClientProfilePayload<ExtArgs>
      values: Prisma.$TemperatureValuePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      date: Date
      clientProfileId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["temperatureRecord"]>
    composites: {}
  }

  type TemperatureRecordGetPayload<S extends boolean | null | undefined | TemperatureRecordDefaultArgs> = $Result.GetResult<Prisma.$TemperatureRecordPayload, S>

  type TemperatureRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TemperatureRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TemperatureRecordCountAggregateInputType | true
    }

  export interface TemperatureRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TemperatureRecord'], meta: { name: 'TemperatureRecord' } }
    /**
     * Find zero or one TemperatureRecord that matches the filter.
     * @param {TemperatureRecordFindUniqueArgs} args - Arguments to find a TemperatureRecord
     * @example
     * // Get one TemperatureRecord
     * const temperatureRecord = await prisma.temperatureRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TemperatureRecordFindUniqueArgs>(args: SelectSubset<T, TemperatureRecordFindUniqueArgs<ExtArgs>>): Prisma__TemperatureRecordClient<$Result.GetResult<Prisma.$TemperatureRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TemperatureRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TemperatureRecordFindUniqueOrThrowArgs} args - Arguments to find a TemperatureRecord
     * @example
     * // Get one TemperatureRecord
     * const temperatureRecord = await prisma.temperatureRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TemperatureRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, TemperatureRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TemperatureRecordClient<$Result.GetResult<Prisma.$TemperatureRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TemperatureRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemperatureRecordFindFirstArgs} args - Arguments to find a TemperatureRecord
     * @example
     * // Get one TemperatureRecord
     * const temperatureRecord = await prisma.temperatureRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TemperatureRecordFindFirstArgs>(args?: SelectSubset<T, TemperatureRecordFindFirstArgs<ExtArgs>>): Prisma__TemperatureRecordClient<$Result.GetResult<Prisma.$TemperatureRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TemperatureRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemperatureRecordFindFirstOrThrowArgs} args - Arguments to find a TemperatureRecord
     * @example
     * // Get one TemperatureRecord
     * const temperatureRecord = await prisma.temperatureRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TemperatureRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, TemperatureRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__TemperatureRecordClient<$Result.GetResult<Prisma.$TemperatureRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TemperatureRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemperatureRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TemperatureRecords
     * const temperatureRecords = await prisma.temperatureRecord.findMany()
     * 
     * // Get first 10 TemperatureRecords
     * const temperatureRecords = await prisma.temperatureRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const temperatureRecordWithIdOnly = await prisma.temperatureRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TemperatureRecordFindManyArgs>(args?: SelectSubset<T, TemperatureRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemperatureRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TemperatureRecord.
     * @param {TemperatureRecordCreateArgs} args - Arguments to create a TemperatureRecord.
     * @example
     * // Create one TemperatureRecord
     * const TemperatureRecord = await prisma.temperatureRecord.create({
     *   data: {
     *     // ... data to create a TemperatureRecord
     *   }
     * })
     * 
     */
    create<T extends TemperatureRecordCreateArgs>(args: SelectSubset<T, TemperatureRecordCreateArgs<ExtArgs>>): Prisma__TemperatureRecordClient<$Result.GetResult<Prisma.$TemperatureRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TemperatureRecords.
     * @param {TemperatureRecordCreateManyArgs} args - Arguments to create many TemperatureRecords.
     * @example
     * // Create many TemperatureRecords
     * const temperatureRecord = await prisma.temperatureRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TemperatureRecordCreateManyArgs>(args?: SelectSubset<T, TemperatureRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TemperatureRecords and returns the data saved in the database.
     * @param {TemperatureRecordCreateManyAndReturnArgs} args - Arguments to create many TemperatureRecords.
     * @example
     * // Create many TemperatureRecords
     * const temperatureRecord = await prisma.temperatureRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TemperatureRecords and only return the `id`
     * const temperatureRecordWithIdOnly = await prisma.temperatureRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TemperatureRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, TemperatureRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemperatureRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TemperatureRecord.
     * @param {TemperatureRecordDeleteArgs} args - Arguments to delete one TemperatureRecord.
     * @example
     * // Delete one TemperatureRecord
     * const TemperatureRecord = await prisma.temperatureRecord.delete({
     *   where: {
     *     // ... filter to delete one TemperatureRecord
     *   }
     * })
     * 
     */
    delete<T extends TemperatureRecordDeleteArgs>(args: SelectSubset<T, TemperatureRecordDeleteArgs<ExtArgs>>): Prisma__TemperatureRecordClient<$Result.GetResult<Prisma.$TemperatureRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TemperatureRecord.
     * @param {TemperatureRecordUpdateArgs} args - Arguments to update one TemperatureRecord.
     * @example
     * // Update one TemperatureRecord
     * const temperatureRecord = await prisma.temperatureRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TemperatureRecordUpdateArgs>(args: SelectSubset<T, TemperatureRecordUpdateArgs<ExtArgs>>): Prisma__TemperatureRecordClient<$Result.GetResult<Prisma.$TemperatureRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TemperatureRecords.
     * @param {TemperatureRecordDeleteManyArgs} args - Arguments to filter TemperatureRecords to delete.
     * @example
     * // Delete a few TemperatureRecords
     * const { count } = await prisma.temperatureRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TemperatureRecordDeleteManyArgs>(args?: SelectSubset<T, TemperatureRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TemperatureRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemperatureRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TemperatureRecords
     * const temperatureRecord = await prisma.temperatureRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TemperatureRecordUpdateManyArgs>(args: SelectSubset<T, TemperatureRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TemperatureRecord.
     * @param {TemperatureRecordUpsertArgs} args - Arguments to update or create a TemperatureRecord.
     * @example
     * // Update or create a TemperatureRecord
     * const temperatureRecord = await prisma.temperatureRecord.upsert({
     *   create: {
     *     // ... data to create a TemperatureRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TemperatureRecord we want to update
     *   }
     * })
     */
    upsert<T extends TemperatureRecordUpsertArgs>(args: SelectSubset<T, TemperatureRecordUpsertArgs<ExtArgs>>): Prisma__TemperatureRecordClient<$Result.GetResult<Prisma.$TemperatureRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TemperatureRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemperatureRecordCountArgs} args - Arguments to filter TemperatureRecords to count.
     * @example
     * // Count the number of TemperatureRecords
     * const count = await prisma.temperatureRecord.count({
     *   where: {
     *     // ... the filter for the TemperatureRecords we want to count
     *   }
     * })
    **/
    count<T extends TemperatureRecordCountArgs>(
      args?: Subset<T, TemperatureRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TemperatureRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TemperatureRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemperatureRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TemperatureRecordAggregateArgs>(args: Subset<T, TemperatureRecordAggregateArgs>): Prisma.PrismaPromise<GetTemperatureRecordAggregateType<T>>

    /**
     * Group by TemperatureRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemperatureRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TemperatureRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TemperatureRecordGroupByArgs['orderBy'] }
        : { orderBy?: TemperatureRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TemperatureRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTemperatureRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TemperatureRecord model
   */
  readonly fields: TemperatureRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TemperatureRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TemperatureRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clientProfile<T extends ClientProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientProfileDefaultArgs<ExtArgs>>): Prisma__ClientProfileClient<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    values<T extends TemperatureRecord$valuesArgs<ExtArgs> = {}>(args?: Subset<T, TemperatureRecord$valuesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemperatureValuePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TemperatureRecord model
   */ 
  interface TemperatureRecordFieldRefs {
    readonly id: FieldRef<"TemperatureRecord", 'Int'>
    readonly date: FieldRef<"TemperatureRecord", 'DateTime'>
    readonly clientProfileId: FieldRef<"TemperatureRecord", 'Int'>
    readonly createdAt: FieldRef<"TemperatureRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"TemperatureRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TemperatureRecord findUnique
   */
  export type TemperatureRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureRecord
     */
    select?: TemperatureRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureRecordInclude<ExtArgs> | null
    /**
     * Filter, which TemperatureRecord to fetch.
     */
    where: TemperatureRecordWhereUniqueInput
  }

  /**
   * TemperatureRecord findUniqueOrThrow
   */
  export type TemperatureRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureRecord
     */
    select?: TemperatureRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureRecordInclude<ExtArgs> | null
    /**
     * Filter, which TemperatureRecord to fetch.
     */
    where: TemperatureRecordWhereUniqueInput
  }

  /**
   * TemperatureRecord findFirst
   */
  export type TemperatureRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureRecord
     */
    select?: TemperatureRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureRecordInclude<ExtArgs> | null
    /**
     * Filter, which TemperatureRecord to fetch.
     */
    where?: TemperatureRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemperatureRecords to fetch.
     */
    orderBy?: TemperatureRecordOrderByWithRelationInput | TemperatureRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TemperatureRecords.
     */
    cursor?: TemperatureRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemperatureRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemperatureRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TemperatureRecords.
     */
    distinct?: TemperatureRecordScalarFieldEnum | TemperatureRecordScalarFieldEnum[]
  }

  /**
   * TemperatureRecord findFirstOrThrow
   */
  export type TemperatureRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureRecord
     */
    select?: TemperatureRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureRecordInclude<ExtArgs> | null
    /**
     * Filter, which TemperatureRecord to fetch.
     */
    where?: TemperatureRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemperatureRecords to fetch.
     */
    orderBy?: TemperatureRecordOrderByWithRelationInput | TemperatureRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TemperatureRecords.
     */
    cursor?: TemperatureRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemperatureRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemperatureRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TemperatureRecords.
     */
    distinct?: TemperatureRecordScalarFieldEnum | TemperatureRecordScalarFieldEnum[]
  }

  /**
   * TemperatureRecord findMany
   */
  export type TemperatureRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureRecord
     */
    select?: TemperatureRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureRecordInclude<ExtArgs> | null
    /**
     * Filter, which TemperatureRecords to fetch.
     */
    where?: TemperatureRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemperatureRecords to fetch.
     */
    orderBy?: TemperatureRecordOrderByWithRelationInput | TemperatureRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TemperatureRecords.
     */
    cursor?: TemperatureRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemperatureRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemperatureRecords.
     */
    skip?: number
    distinct?: TemperatureRecordScalarFieldEnum | TemperatureRecordScalarFieldEnum[]
  }

  /**
   * TemperatureRecord create
   */
  export type TemperatureRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureRecord
     */
    select?: TemperatureRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a TemperatureRecord.
     */
    data: XOR<TemperatureRecordCreateInput, TemperatureRecordUncheckedCreateInput>
  }

  /**
   * TemperatureRecord createMany
   */
  export type TemperatureRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TemperatureRecords.
     */
    data: TemperatureRecordCreateManyInput | TemperatureRecordCreateManyInput[]
  }

  /**
   * TemperatureRecord createManyAndReturn
   */
  export type TemperatureRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureRecord
     */
    select?: TemperatureRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TemperatureRecords.
     */
    data: TemperatureRecordCreateManyInput | TemperatureRecordCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TemperatureRecord update
   */
  export type TemperatureRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureRecord
     */
    select?: TemperatureRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a TemperatureRecord.
     */
    data: XOR<TemperatureRecordUpdateInput, TemperatureRecordUncheckedUpdateInput>
    /**
     * Choose, which TemperatureRecord to update.
     */
    where: TemperatureRecordWhereUniqueInput
  }

  /**
   * TemperatureRecord updateMany
   */
  export type TemperatureRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TemperatureRecords.
     */
    data: XOR<TemperatureRecordUpdateManyMutationInput, TemperatureRecordUncheckedUpdateManyInput>
    /**
     * Filter which TemperatureRecords to update
     */
    where?: TemperatureRecordWhereInput
  }

  /**
   * TemperatureRecord upsert
   */
  export type TemperatureRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureRecord
     */
    select?: TemperatureRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the TemperatureRecord to update in case it exists.
     */
    where: TemperatureRecordWhereUniqueInput
    /**
     * In case the TemperatureRecord found by the `where` argument doesn't exist, create a new TemperatureRecord with this data.
     */
    create: XOR<TemperatureRecordCreateInput, TemperatureRecordUncheckedCreateInput>
    /**
     * In case the TemperatureRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TemperatureRecordUpdateInput, TemperatureRecordUncheckedUpdateInput>
  }

  /**
   * TemperatureRecord delete
   */
  export type TemperatureRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureRecord
     */
    select?: TemperatureRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureRecordInclude<ExtArgs> | null
    /**
     * Filter which TemperatureRecord to delete.
     */
    where: TemperatureRecordWhereUniqueInput
  }

  /**
   * TemperatureRecord deleteMany
   */
  export type TemperatureRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TemperatureRecords to delete
     */
    where?: TemperatureRecordWhereInput
  }

  /**
   * TemperatureRecord.values
   */
  export type TemperatureRecord$valuesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureValue
     */
    select?: TemperatureValueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureValueInclude<ExtArgs> | null
    where?: TemperatureValueWhereInput
    orderBy?: TemperatureValueOrderByWithRelationInput | TemperatureValueOrderByWithRelationInput[]
    cursor?: TemperatureValueWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TemperatureValueScalarFieldEnum | TemperatureValueScalarFieldEnum[]
  }

  /**
   * TemperatureRecord without action
   */
  export type TemperatureRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureRecord
     */
    select?: TemperatureRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureRecordInclude<ExtArgs> | null
  }


  /**
   * Model TemperatureValue
   */

  export type AggregateTemperatureValue = {
    _count: TemperatureValueCountAggregateOutputType | null
    _avg: TemperatureValueAvgAggregateOutputType | null
    _sum: TemperatureValueSumAggregateOutputType | null
    _min: TemperatureValueMinAggregateOutputType | null
    _max: TemperatureValueMaxAggregateOutputType | null
  }

  export type TemperatureValueAvgAggregateOutputType = {
    id: number | null
    value: number | null
    chamberId: number | null
    temperatureRecordId: number | null
  }

  export type TemperatureValueSumAggregateOutputType = {
    id: number | null
    value: number | null
    chamberId: number | null
    temperatureRecordId: number | null
  }

  export type TemperatureValueMinAggregateOutputType = {
    id: number | null
    value: number | null
    chamberId: number | null
    temperatureRecordId: number | null
  }

  export type TemperatureValueMaxAggregateOutputType = {
    id: number | null
    value: number | null
    chamberId: number | null
    temperatureRecordId: number | null
  }

  export type TemperatureValueCountAggregateOutputType = {
    id: number
    value: number
    chamberId: number
    temperatureRecordId: number
    _all: number
  }


  export type TemperatureValueAvgAggregateInputType = {
    id?: true
    value?: true
    chamberId?: true
    temperatureRecordId?: true
  }

  export type TemperatureValueSumAggregateInputType = {
    id?: true
    value?: true
    chamberId?: true
    temperatureRecordId?: true
  }

  export type TemperatureValueMinAggregateInputType = {
    id?: true
    value?: true
    chamberId?: true
    temperatureRecordId?: true
  }

  export type TemperatureValueMaxAggregateInputType = {
    id?: true
    value?: true
    chamberId?: true
    temperatureRecordId?: true
  }

  export type TemperatureValueCountAggregateInputType = {
    id?: true
    value?: true
    chamberId?: true
    temperatureRecordId?: true
    _all?: true
  }

  export type TemperatureValueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TemperatureValue to aggregate.
     */
    where?: TemperatureValueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemperatureValues to fetch.
     */
    orderBy?: TemperatureValueOrderByWithRelationInput | TemperatureValueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TemperatureValueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemperatureValues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemperatureValues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TemperatureValues
    **/
    _count?: true | TemperatureValueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TemperatureValueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TemperatureValueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TemperatureValueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TemperatureValueMaxAggregateInputType
  }

  export type GetTemperatureValueAggregateType<T extends TemperatureValueAggregateArgs> = {
        [P in keyof T & keyof AggregateTemperatureValue]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTemperatureValue[P]>
      : GetScalarType<T[P], AggregateTemperatureValue[P]>
  }




  export type TemperatureValueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemperatureValueWhereInput
    orderBy?: TemperatureValueOrderByWithAggregationInput | TemperatureValueOrderByWithAggregationInput[]
    by: TemperatureValueScalarFieldEnum[] | TemperatureValueScalarFieldEnum
    having?: TemperatureValueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TemperatureValueCountAggregateInputType | true
    _avg?: TemperatureValueAvgAggregateInputType
    _sum?: TemperatureValueSumAggregateInputType
    _min?: TemperatureValueMinAggregateInputType
    _max?: TemperatureValueMaxAggregateInputType
  }

  export type TemperatureValueGroupByOutputType = {
    id: number
    value: number
    chamberId: number
    temperatureRecordId: number
    _count: TemperatureValueCountAggregateOutputType | null
    _avg: TemperatureValueAvgAggregateOutputType | null
    _sum: TemperatureValueSumAggregateOutputType | null
    _min: TemperatureValueMinAggregateOutputType | null
    _max: TemperatureValueMaxAggregateOutputType | null
  }

  type GetTemperatureValueGroupByPayload<T extends TemperatureValueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TemperatureValueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TemperatureValueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TemperatureValueGroupByOutputType[P]>
            : GetScalarType<T[P], TemperatureValueGroupByOutputType[P]>
        }
      >
    >


  export type TemperatureValueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    value?: boolean
    chamberId?: boolean
    temperatureRecordId?: boolean
    chamber?: boolean | ChamberDefaultArgs<ExtArgs>
    record?: boolean | TemperatureRecordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["temperatureValue"]>

  export type TemperatureValueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    value?: boolean
    chamberId?: boolean
    temperatureRecordId?: boolean
    chamber?: boolean | ChamberDefaultArgs<ExtArgs>
    record?: boolean | TemperatureRecordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["temperatureValue"]>

  export type TemperatureValueSelectScalar = {
    id?: boolean
    value?: boolean
    chamberId?: boolean
    temperatureRecordId?: boolean
  }

  export type TemperatureValueInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chamber?: boolean | ChamberDefaultArgs<ExtArgs>
    record?: boolean | TemperatureRecordDefaultArgs<ExtArgs>
  }
  export type TemperatureValueIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chamber?: boolean | ChamberDefaultArgs<ExtArgs>
    record?: boolean | TemperatureRecordDefaultArgs<ExtArgs>
  }

  export type $TemperatureValuePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TemperatureValue"
    objects: {
      chamber: Prisma.$ChamberPayload<ExtArgs>
      record: Prisma.$TemperatureRecordPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      value: number
      chamberId: number
      temperatureRecordId: number
    }, ExtArgs["result"]["temperatureValue"]>
    composites: {}
  }

  type TemperatureValueGetPayload<S extends boolean | null | undefined | TemperatureValueDefaultArgs> = $Result.GetResult<Prisma.$TemperatureValuePayload, S>

  type TemperatureValueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TemperatureValueFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TemperatureValueCountAggregateInputType | true
    }

  export interface TemperatureValueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TemperatureValue'], meta: { name: 'TemperatureValue' } }
    /**
     * Find zero or one TemperatureValue that matches the filter.
     * @param {TemperatureValueFindUniqueArgs} args - Arguments to find a TemperatureValue
     * @example
     * // Get one TemperatureValue
     * const temperatureValue = await prisma.temperatureValue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TemperatureValueFindUniqueArgs>(args: SelectSubset<T, TemperatureValueFindUniqueArgs<ExtArgs>>): Prisma__TemperatureValueClient<$Result.GetResult<Prisma.$TemperatureValuePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TemperatureValue that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TemperatureValueFindUniqueOrThrowArgs} args - Arguments to find a TemperatureValue
     * @example
     * // Get one TemperatureValue
     * const temperatureValue = await prisma.temperatureValue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TemperatureValueFindUniqueOrThrowArgs>(args: SelectSubset<T, TemperatureValueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TemperatureValueClient<$Result.GetResult<Prisma.$TemperatureValuePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TemperatureValue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemperatureValueFindFirstArgs} args - Arguments to find a TemperatureValue
     * @example
     * // Get one TemperatureValue
     * const temperatureValue = await prisma.temperatureValue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TemperatureValueFindFirstArgs>(args?: SelectSubset<T, TemperatureValueFindFirstArgs<ExtArgs>>): Prisma__TemperatureValueClient<$Result.GetResult<Prisma.$TemperatureValuePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TemperatureValue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemperatureValueFindFirstOrThrowArgs} args - Arguments to find a TemperatureValue
     * @example
     * // Get one TemperatureValue
     * const temperatureValue = await prisma.temperatureValue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TemperatureValueFindFirstOrThrowArgs>(args?: SelectSubset<T, TemperatureValueFindFirstOrThrowArgs<ExtArgs>>): Prisma__TemperatureValueClient<$Result.GetResult<Prisma.$TemperatureValuePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TemperatureValues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemperatureValueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TemperatureValues
     * const temperatureValues = await prisma.temperatureValue.findMany()
     * 
     * // Get first 10 TemperatureValues
     * const temperatureValues = await prisma.temperatureValue.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const temperatureValueWithIdOnly = await prisma.temperatureValue.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TemperatureValueFindManyArgs>(args?: SelectSubset<T, TemperatureValueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemperatureValuePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TemperatureValue.
     * @param {TemperatureValueCreateArgs} args - Arguments to create a TemperatureValue.
     * @example
     * // Create one TemperatureValue
     * const TemperatureValue = await prisma.temperatureValue.create({
     *   data: {
     *     // ... data to create a TemperatureValue
     *   }
     * })
     * 
     */
    create<T extends TemperatureValueCreateArgs>(args: SelectSubset<T, TemperatureValueCreateArgs<ExtArgs>>): Prisma__TemperatureValueClient<$Result.GetResult<Prisma.$TemperatureValuePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TemperatureValues.
     * @param {TemperatureValueCreateManyArgs} args - Arguments to create many TemperatureValues.
     * @example
     * // Create many TemperatureValues
     * const temperatureValue = await prisma.temperatureValue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TemperatureValueCreateManyArgs>(args?: SelectSubset<T, TemperatureValueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TemperatureValues and returns the data saved in the database.
     * @param {TemperatureValueCreateManyAndReturnArgs} args - Arguments to create many TemperatureValues.
     * @example
     * // Create many TemperatureValues
     * const temperatureValue = await prisma.temperatureValue.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TemperatureValues and only return the `id`
     * const temperatureValueWithIdOnly = await prisma.temperatureValue.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TemperatureValueCreateManyAndReturnArgs>(args?: SelectSubset<T, TemperatureValueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemperatureValuePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TemperatureValue.
     * @param {TemperatureValueDeleteArgs} args - Arguments to delete one TemperatureValue.
     * @example
     * // Delete one TemperatureValue
     * const TemperatureValue = await prisma.temperatureValue.delete({
     *   where: {
     *     // ... filter to delete one TemperatureValue
     *   }
     * })
     * 
     */
    delete<T extends TemperatureValueDeleteArgs>(args: SelectSubset<T, TemperatureValueDeleteArgs<ExtArgs>>): Prisma__TemperatureValueClient<$Result.GetResult<Prisma.$TemperatureValuePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TemperatureValue.
     * @param {TemperatureValueUpdateArgs} args - Arguments to update one TemperatureValue.
     * @example
     * // Update one TemperatureValue
     * const temperatureValue = await prisma.temperatureValue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TemperatureValueUpdateArgs>(args: SelectSubset<T, TemperatureValueUpdateArgs<ExtArgs>>): Prisma__TemperatureValueClient<$Result.GetResult<Prisma.$TemperatureValuePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TemperatureValues.
     * @param {TemperatureValueDeleteManyArgs} args - Arguments to filter TemperatureValues to delete.
     * @example
     * // Delete a few TemperatureValues
     * const { count } = await prisma.temperatureValue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TemperatureValueDeleteManyArgs>(args?: SelectSubset<T, TemperatureValueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TemperatureValues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemperatureValueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TemperatureValues
     * const temperatureValue = await prisma.temperatureValue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TemperatureValueUpdateManyArgs>(args: SelectSubset<T, TemperatureValueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TemperatureValue.
     * @param {TemperatureValueUpsertArgs} args - Arguments to update or create a TemperatureValue.
     * @example
     * // Update or create a TemperatureValue
     * const temperatureValue = await prisma.temperatureValue.upsert({
     *   create: {
     *     // ... data to create a TemperatureValue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TemperatureValue we want to update
     *   }
     * })
     */
    upsert<T extends TemperatureValueUpsertArgs>(args: SelectSubset<T, TemperatureValueUpsertArgs<ExtArgs>>): Prisma__TemperatureValueClient<$Result.GetResult<Prisma.$TemperatureValuePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TemperatureValues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemperatureValueCountArgs} args - Arguments to filter TemperatureValues to count.
     * @example
     * // Count the number of TemperatureValues
     * const count = await prisma.temperatureValue.count({
     *   where: {
     *     // ... the filter for the TemperatureValues we want to count
     *   }
     * })
    **/
    count<T extends TemperatureValueCountArgs>(
      args?: Subset<T, TemperatureValueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TemperatureValueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TemperatureValue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemperatureValueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TemperatureValueAggregateArgs>(args: Subset<T, TemperatureValueAggregateArgs>): Prisma.PrismaPromise<GetTemperatureValueAggregateType<T>>

    /**
     * Group by TemperatureValue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemperatureValueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TemperatureValueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TemperatureValueGroupByArgs['orderBy'] }
        : { orderBy?: TemperatureValueGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TemperatureValueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTemperatureValueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TemperatureValue model
   */
  readonly fields: TemperatureValueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TemperatureValue.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TemperatureValueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    chamber<T extends ChamberDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChamberDefaultArgs<ExtArgs>>): Prisma__ChamberClient<$Result.GetResult<Prisma.$ChamberPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    record<T extends TemperatureRecordDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TemperatureRecordDefaultArgs<ExtArgs>>): Prisma__TemperatureRecordClient<$Result.GetResult<Prisma.$TemperatureRecordPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TemperatureValue model
   */ 
  interface TemperatureValueFieldRefs {
    readonly id: FieldRef<"TemperatureValue", 'Int'>
    readonly value: FieldRef<"TemperatureValue", 'Float'>
    readonly chamberId: FieldRef<"TemperatureValue", 'Int'>
    readonly temperatureRecordId: FieldRef<"TemperatureValue", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * TemperatureValue findUnique
   */
  export type TemperatureValueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureValue
     */
    select?: TemperatureValueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureValueInclude<ExtArgs> | null
    /**
     * Filter, which TemperatureValue to fetch.
     */
    where: TemperatureValueWhereUniqueInput
  }

  /**
   * TemperatureValue findUniqueOrThrow
   */
  export type TemperatureValueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureValue
     */
    select?: TemperatureValueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureValueInclude<ExtArgs> | null
    /**
     * Filter, which TemperatureValue to fetch.
     */
    where: TemperatureValueWhereUniqueInput
  }

  /**
   * TemperatureValue findFirst
   */
  export type TemperatureValueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureValue
     */
    select?: TemperatureValueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureValueInclude<ExtArgs> | null
    /**
     * Filter, which TemperatureValue to fetch.
     */
    where?: TemperatureValueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemperatureValues to fetch.
     */
    orderBy?: TemperatureValueOrderByWithRelationInput | TemperatureValueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TemperatureValues.
     */
    cursor?: TemperatureValueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemperatureValues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemperatureValues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TemperatureValues.
     */
    distinct?: TemperatureValueScalarFieldEnum | TemperatureValueScalarFieldEnum[]
  }

  /**
   * TemperatureValue findFirstOrThrow
   */
  export type TemperatureValueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureValue
     */
    select?: TemperatureValueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureValueInclude<ExtArgs> | null
    /**
     * Filter, which TemperatureValue to fetch.
     */
    where?: TemperatureValueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemperatureValues to fetch.
     */
    orderBy?: TemperatureValueOrderByWithRelationInput | TemperatureValueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TemperatureValues.
     */
    cursor?: TemperatureValueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemperatureValues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemperatureValues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TemperatureValues.
     */
    distinct?: TemperatureValueScalarFieldEnum | TemperatureValueScalarFieldEnum[]
  }

  /**
   * TemperatureValue findMany
   */
  export type TemperatureValueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureValue
     */
    select?: TemperatureValueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureValueInclude<ExtArgs> | null
    /**
     * Filter, which TemperatureValues to fetch.
     */
    where?: TemperatureValueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemperatureValues to fetch.
     */
    orderBy?: TemperatureValueOrderByWithRelationInput | TemperatureValueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TemperatureValues.
     */
    cursor?: TemperatureValueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemperatureValues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemperatureValues.
     */
    skip?: number
    distinct?: TemperatureValueScalarFieldEnum | TemperatureValueScalarFieldEnum[]
  }

  /**
   * TemperatureValue create
   */
  export type TemperatureValueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureValue
     */
    select?: TemperatureValueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureValueInclude<ExtArgs> | null
    /**
     * The data needed to create a TemperatureValue.
     */
    data: XOR<TemperatureValueCreateInput, TemperatureValueUncheckedCreateInput>
  }

  /**
   * TemperatureValue createMany
   */
  export type TemperatureValueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TemperatureValues.
     */
    data: TemperatureValueCreateManyInput | TemperatureValueCreateManyInput[]
  }

  /**
   * TemperatureValue createManyAndReturn
   */
  export type TemperatureValueCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureValue
     */
    select?: TemperatureValueSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TemperatureValues.
     */
    data: TemperatureValueCreateManyInput | TemperatureValueCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureValueIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TemperatureValue update
   */
  export type TemperatureValueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureValue
     */
    select?: TemperatureValueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureValueInclude<ExtArgs> | null
    /**
     * The data needed to update a TemperatureValue.
     */
    data: XOR<TemperatureValueUpdateInput, TemperatureValueUncheckedUpdateInput>
    /**
     * Choose, which TemperatureValue to update.
     */
    where: TemperatureValueWhereUniqueInput
  }

  /**
   * TemperatureValue updateMany
   */
  export type TemperatureValueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TemperatureValues.
     */
    data: XOR<TemperatureValueUpdateManyMutationInput, TemperatureValueUncheckedUpdateManyInput>
    /**
     * Filter which TemperatureValues to update
     */
    where?: TemperatureValueWhereInput
  }

  /**
   * TemperatureValue upsert
   */
  export type TemperatureValueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureValue
     */
    select?: TemperatureValueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureValueInclude<ExtArgs> | null
    /**
     * The filter to search for the TemperatureValue to update in case it exists.
     */
    where: TemperatureValueWhereUniqueInput
    /**
     * In case the TemperatureValue found by the `where` argument doesn't exist, create a new TemperatureValue with this data.
     */
    create: XOR<TemperatureValueCreateInput, TemperatureValueUncheckedCreateInput>
    /**
     * In case the TemperatureValue was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TemperatureValueUpdateInput, TemperatureValueUncheckedUpdateInput>
  }

  /**
   * TemperatureValue delete
   */
  export type TemperatureValueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureValue
     */
    select?: TemperatureValueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureValueInclude<ExtArgs> | null
    /**
     * Filter which TemperatureValue to delete.
     */
    where: TemperatureValueWhereUniqueInput
  }

  /**
   * TemperatureValue deleteMany
   */
  export type TemperatureValueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TemperatureValues to delete
     */
    where?: TemperatureValueWhereInput
  }

  /**
   * TemperatureValue without action
   */
  export type TemperatureValueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemperatureValue
     */
    select?: TemperatureValueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemperatureValueInclude<ExtArgs> | null
  }


  /**
   * Model GoodsReceipt
   */

  export type AggregateGoodsReceipt = {
    _count: GoodsReceiptCountAggregateOutputType | null
    _avg: GoodsReceiptAvgAggregateOutputType | null
    _sum: GoodsReceiptSumAggregateOutputType | null
    _min: GoodsReceiptMinAggregateOutputType | null
    _max: GoodsReceiptMaxAggregateOutputType | null
  }

  export type GoodsReceiptAvgAggregateOutputType = {
    id: number | null
    clientProfileId: number | null
  }

  export type GoodsReceiptSumAggregateOutputType = {
    id: number | null
    clientProfileId: number | null
  }

  export type GoodsReceiptMinAggregateOutputType = {
    id: number | null
    providerName: string | null
    productName: string | null
    lote: string | null
    invoiceNumber: string | null
    quantity: string | null
    date: Date | null
    deliveryNoteImage: string | null
    clientProfileId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GoodsReceiptMaxAggregateOutputType = {
    id: number | null
    providerName: string | null
    productName: string | null
    lote: string | null
    invoiceNumber: string | null
    quantity: string | null
    date: Date | null
    deliveryNoteImage: string | null
    clientProfileId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GoodsReceiptCountAggregateOutputType = {
    id: number
    providerName: number
    productName: number
    lote: number
    invoiceNumber: number
    quantity: number
    date: number
    deliveryNoteImage: number
    clientProfileId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GoodsReceiptAvgAggregateInputType = {
    id?: true
    clientProfileId?: true
  }

  export type GoodsReceiptSumAggregateInputType = {
    id?: true
    clientProfileId?: true
  }

  export type GoodsReceiptMinAggregateInputType = {
    id?: true
    providerName?: true
    productName?: true
    lote?: true
    invoiceNumber?: true
    quantity?: true
    date?: true
    deliveryNoteImage?: true
    clientProfileId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GoodsReceiptMaxAggregateInputType = {
    id?: true
    providerName?: true
    productName?: true
    lote?: true
    invoiceNumber?: true
    quantity?: true
    date?: true
    deliveryNoteImage?: true
    clientProfileId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GoodsReceiptCountAggregateInputType = {
    id?: true
    providerName?: true
    productName?: true
    lote?: true
    invoiceNumber?: true
    quantity?: true
    date?: true
    deliveryNoteImage?: true
    clientProfileId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GoodsReceiptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GoodsReceipt to aggregate.
     */
    where?: GoodsReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoodsReceipts to fetch.
     */
    orderBy?: GoodsReceiptOrderByWithRelationInput | GoodsReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GoodsReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoodsReceipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoodsReceipts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GoodsReceipts
    **/
    _count?: true | GoodsReceiptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GoodsReceiptAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GoodsReceiptSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GoodsReceiptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GoodsReceiptMaxAggregateInputType
  }

  export type GetGoodsReceiptAggregateType<T extends GoodsReceiptAggregateArgs> = {
        [P in keyof T & keyof AggregateGoodsReceipt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGoodsReceipt[P]>
      : GetScalarType<T[P], AggregateGoodsReceipt[P]>
  }




  export type GoodsReceiptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GoodsReceiptWhereInput
    orderBy?: GoodsReceiptOrderByWithAggregationInput | GoodsReceiptOrderByWithAggregationInput[]
    by: GoodsReceiptScalarFieldEnum[] | GoodsReceiptScalarFieldEnum
    having?: GoodsReceiptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GoodsReceiptCountAggregateInputType | true
    _avg?: GoodsReceiptAvgAggregateInputType
    _sum?: GoodsReceiptSumAggregateInputType
    _min?: GoodsReceiptMinAggregateInputType
    _max?: GoodsReceiptMaxAggregateInputType
  }

  export type GoodsReceiptGroupByOutputType = {
    id: number
    providerName: string | null
    productName: string
    lote: string | null
    invoiceNumber: string | null
    quantity: string | null
    date: Date
    deliveryNoteImage: string | null
    clientProfileId: number
    createdAt: Date
    updatedAt: Date
    _count: GoodsReceiptCountAggregateOutputType | null
    _avg: GoodsReceiptAvgAggregateOutputType | null
    _sum: GoodsReceiptSumAggregateOutputType | null
    _min: GoodsReceiptMinAggregateOutputType | null
    _max: GoodsReceiptMaxAggregateOutputType | null
  }

  type GetGoodsReceiptGroupByPayload<T extends GoodsReceiptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GoodsReceiptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GoodsReceiptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GoodsReceiptGroupByOutputType[P]>
            : GetScalarType<T[P], GoodsReceiptGroupByOutputType[P]>
        }
      >
    >


  export type GoodsReceiptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    providerName?: boolean
    productName?: boolean
    lote?: boolean
    invoiceNumber?: boolean
    quantity?: boolean
    date?: boolean
    deliveryNoteImage?: boolean
    clientProfileId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["goodsReceipt"]>

  export type GoodsReceiptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    providerName?: boolean
    productName?: boolean
    lote?: boolean
    invoiceNumber?: boolean
    quantity?: boolean
    date?: boolean
    deliveryNoteImage?: boolean
    clientProfileId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["goodsReceipt"]>

  export type GoodsReceiptSelectScalar = {
    id?: boolean
    providerName?: boolean
    productName?: boolean
    lote?: boolean
    invoiceNumber?: boolean
    quantity?: boolean
    date?: boolean
    deliveryNoteImage?: boolean
    clientProfileId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GoodsReceiptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
  }
  export type GoodsReceiptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientProfile?: boolean | ClientProfileDefaultArgs<ExtArgs>
  }

  export type $GoodsReceiptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GoodsReceipt"
    objects: {
      clientProfile: Prisma.$ClientProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      providerName: string | null
      productName: string
      lote: string | null
      invoiceNumber: string | null
      quantity: string | null
      date: Date
      deliveryNoteImage: string | null
      clientProfileId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["goodsReceipt"]>
    composites: {}
  }

  type GoodsReceiptGetPayload<S extends boolean | null | undefined | GoodsReceiptDefaultArgs> = $Result.GetResult<Prisma.$GoodsReceiptPayload, S>

  type GoodsReceiptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GoodsReceiptFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GoodsReceiptCountAggregateInputType | true
    }

  export interface GoodsReceiptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GoodsReceipt'], meta: { name: 'GoodsReceipt' } }
    /**
     * Find zero or one GoodsReceipt that matches the filter.
     * @param {GoodsReceiptFindUniqueArgs} args - Arguments to find a GoodsReceipt
     * @example
     * // Get one GoodsReceipt
     * const goodsReceipt = await prisma.goodsReceipt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GoodsReceiptFindUniqueArgs>(args: SelectSubset<T, GoodsReceiptFindUniqueArgs<ExtArgs>>): Prisma__GoodsReceiptClient<$Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GoodsReceipt that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GoodsReceiptFindUniqueOrThrowArgs} args - Arguments to find a GoodsReceipt
     * @example
     * // Get one GoodsReceipt
     * const goodsReceipt = await prisma.goodsReceipt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GoodsReceiptFindUniqueOrThrowArgs>(args: SelectSubset<T, GoodsReceiptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GoodsReceiptClient<$Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GoodsReceipt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoodsReceiptFindFirstArgs} args - Arguments to find a GoodsReceipt
     * @example
     * // Get one GoodsReceipt
     * const goodsReceipt = await prisma.goodsReceipt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GoodsReceiptFindFirstArgs>(args?: SelectSubset<T, GoodsReceiptFindFirstArgs<ExtArgs>>): Prisma__GoodsReceiptClient<$Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GoodsReceipt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoodsReceiptFindFirstOrThrowArgs} args - Arguments to find a GoodsReceipt
     * @example
     * // Get one GoodsReceipt
     * const goodsReceipt = await prisma.goodsReceipt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GoodsReceiptFindFirstOrThrowArgs>(args?: SelectSubset<T, GoodsReceiptFindFirstOrThrowArgs<ExtArgs>>): Prisma__GoodsReceiptClient<$Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GoodsReceipts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoodsReceiptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GoodsReceipts
     * const goodsReceipts = await prisma.goodsReceipt.findMany()
     * 
     * // Get first 10 GoodsReceipts
     * const goodsReceipts = await prisma.goodsReceipt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const goodsReceiptWithIdOnly = await prisma.goodsReceipt.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GoodsReceiptFindManyArgs>(args?: SelectSubset<T, GoodsReceiptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GoodsReceipt.
     * @param {GoodsReceiptCreateArgs} args - Arguments to create a GoodsReceipt.
     * @example
     * // Create one GoodsReceipt
     * const GoodsReceipt = await prisma.goodsReceipt.create({
     *   data: {
     *     // ... data to create a GoodsReceipt
     *   }
     * })
     * 
     */
    create<T extends GoodsReceiptCreateArgs>(args: SelectSubset<T, GoodsReceiptCreateArgs<ExtArgs>>): Prisma__GoodsReceiptClient<$Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GoodsReceipts.
     * @param {GoodsReceiptCreateManyArgs} args - Arguments to create many GoodsReceipts.
     * @example
     * // Create many GoodsReceipts
     * const goodsReceipt = await prisma.goodsReceipt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GoodsReceiptCreateManyArgs>(args?: SelectSubset<T, GoodsReceiptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GoodsReceipts and returns the data saved in the database.
     * @param {GoodsReceiptCreateManyAndReturnArgs} args - Arguments to create many GoodsReceipts.
     * @example
     * // Create many GoodsReceipts
     * const goodsReceipt = await prisma.goodsReceipt.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GoodsReceipts and only return the `id`
     * const goodsReceiptWithIdOnly = await prisma.goodsReceipt.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GoodsReceiptCreateManyAndReturnArgs>(args?: SelectSubset<T, GoodsReceiptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GoodsReceipt.
     * @param {GoodsReceiptDeleteArgs} args - Arguments to delete one GoodsReceipt.
     * @example
     * // Delete one GoodsReceipt
     * const GoodsReceipt = await prisma.goodsReceipt.delete({
     *   where: {
     *     // ... filter to delete one GoodsReceipt
     *   }
     * })
     * 
     */
    delete<T extends GoodsReceiptDeleteArgs>(args: SelectSubset<T, GoodsReceiptDeleteArgs<ExtArgs>>): Prisma__GoodsReceiptClient<$Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GoodsReceipt.
     * @param {GoodsReceiptUpdateArgs} args - Arguments to update one GoodsReceipt.
     * @example
     * // Update one GoodsReceipt
     * const goodsReceipt = await prisma.goodsReceipt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GoodsReceiptUpdateArgs>(args: SelectSubset<T, GoodsReceiptUpdateArgs<ExtArgs>>): Prisma__GoodsReceiptClient<$Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GoodsReceipts.
     * @param {GoodsReceiptDeleteManyArgs} args - Arguments to filter GoodsReceipts to delete.
     * @example
     * // Delete a few GoodsReceipts
     * const { count } = await prisma.goodsReceipt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GoodsReceiptDeleteManyArgs>(args?: SelectSubset<T, GoodsReceiptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GoodsReceipts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoodsReceiptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GoodsReceipts
     * const goodsReceipt = await prisma.goodsReceipt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GoodsReceiptUpdateManyArgs>(args: SelectSubset<T, GoodsReceiptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GoodsReceipt.
     * @param {GoodsReceiptUpsertArgs} args - Arguments to update or create a GoodsReceipt.
     * @example
     * // Update or create a GoodsReceipt
     * const goodsReceipt = await prisma.goodsReceipt.upsert({
     *   create: {
     *     // ... data to create a GoodsReceipt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GoodsReceipt we want to update
     *   }
     * })
     */
    upsert<T extends GoodsReceiptUpsertArgs>(args: SelectSubset<T, GoodsReceiptUpsertArgs<ExtArgs>>): Prisma__GoodsReceiptClient<$Result.GetResult<Prisma.$GoodsReceiptPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GoodsReceipts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoodsReceiptCountArgs} args - Arguments to filter GoodsReceipts to count.
     * @example
     * // Count the number of GoodsReceipts
     * const count = await prisma.goodsReceipt.count({
     *   where: {
     *     // ... the filter for the GoodsReceipts we want to count
     *   }
     * })
    **/
    count<T extends GoodsReceiptCountArgs>(
      args?: Subset<T, GoodsReceiptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GoodsReceiptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GoodsReceipt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoodsReceiptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GoodsReceiptAggregateArgs>(args: Subset<T, GoodsReceiptAggregateArgs>): Prisma.PrismaPromise<GetGoodsReceiptAggregateType<T>>

    /**
     * Group by GoodsReceipt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoodsReceiptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GoodsReceiptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GoodsReceiptGroupByArgs['orderBy'] }
        : { orderBy?: GoodsReceiptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GoodsReceiptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGoodsReceiptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GoodsReceipt model
   */
  readonly fields: GoodsReceiptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GoodsReceipt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GoodsReceiptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clientProfile<T extends ClientProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientProfileDefaultArgs<ExtArgs>>): Prisma__ClientProfileClient<$Result.GetResult<Prisma.$ClientProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GoodsReceipt model
   */ 
  interface GoodsReceiptFieldRefs {
    readonly id: FieldRef<"GoodsReceipt", 'Int'>
    readonly providerName: FieldRef<"GoodsReceipt", 'String'>
    readonly productName: FieldRef<"GoodsReceipt", 'String'>
    readonly lote: FieldRef<"GoodsReceipt", 'String'>
    readonly invoiceNumber: FieldRef<"GoodsReceipt", 'String'>
    readonly quantity: FieldRef<"GoodsReceipt", 'String'>
    readonly date: FieldRef<"GoodsReceipt", 'DateTime'>
    readonly deliveryNoteImage: FieldRef<"GoodsReceipt", 'String'>
    readonly clientProfileId: FieldRef<"GoodsReceipt", 'Int'>
    readonly createdAt: FieldRef<"GoodsReceipt", 'DateTime'>
    readonly updatedAt: FieldRef<"GoodsReceipt", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GoodsReceipt findUnique
   */
  export type GoodsReceiptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoodsReceipt
     */
    select?: GoodsReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsReceiptInclude<ExtArgs> | null
    /**
     * Filter, which GoodsReceipt to fetch.
     */
    where: GoodsReceiptWhereUniqueInput
  }

  /**
   * GoodsReceipt findUniqueOrThrow
   */
  export type GoodsReceiptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoodsReceipt
     */
    select?: GoodsReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsReceiptInclude<ExtArgs> | null
    /**
     * Filter, which GoodsReceipt to fetch.
     */
    where: GoodsReceiptWhereUniqueInput
  }

  /**
   * GoodsReceipt findFirst
   */
  export type GoodsReceiptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoodsReceipt
     */
    select?: GoodsReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsReceiptInclude<ExtArgs> | null
    /**
     * Filter, which GoodsReceipt to fetch.
     */
    where?: GoodsReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoodsReceipts to fetch.
     */
    orderBy?: GoodsReceiptOrderByWithRelationInput | GoodsReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GoodsReceipts.
     */
    cursor?: GoodsReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoodsReceipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoodsReceipts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GoodsReceipts.
     */
    distinct?: GoodsReceiptScalarFieldEnum | GoodsReceiptScalarFieldEnum[]
  }

  /**
   * GoodsReceipt findFirstOrThrow
   */
  export type GoodsReceiptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoodsReceipt
     */
    select?: GoodsReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsReceiptInclude<ExtArgs> | null
    /**
     * Filter, which GoodsReceipt to fetch.
     */
    where?: GoodsReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoodsReceipts to fetch.
     */
    orderBy?: GoodsReceiptOrderByWithRelationInput | GoodsReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GoodsReceipts.
     */
    cursor?: GoodsReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoodsReceipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoodsReceipts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GoodsReceipts.
     */
    distinct?: GoodsReceiptScalarFieldEnum | GoodsReceiptScalarFieldEnum[]
  }

  /**
   * GoodsReceipt findMany
   */
  export type GoodsReceiptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoodsReceipt
     */
    select?: GoodsReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsReceiptInclude<ExtArgs> | null
    /**
     * Filter, which GoodsReceipts to fetch.
     */
    where?: GoodsReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoodsReceipts to fetch.
     */
    orderBy?: GoodsReceiptOrderByWithRelationInput | GoodsReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GoodsReceipts.
     */
    cursor?: GoodsReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoodsReceipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoodsReceipts.
     */
    skip?: number
    distinct?: GoodsReceiptScalarFieldEnum | GoodsReceiptScalarFieldEnum[]
  }

  /**
   * GoodsReceipt create
   */
  export type GoodsReceiptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoodsReceipt
     */
    select?: GoodsReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsReceiptInclude<ExtArgs> | null
    /**
     * The data needed to create a GoodsReceipt.
     */
    data: XOR<GoodsReceiptCreateInput, GoodsReceiptUncheckedCreateInput>
  }

  /**
   * GoodsReceipt createMany
   */
  export type GoodsReceiptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GoodsReceipts.
     */
    data: GoodsReceiptCreateManyInput | GoodsReceiptCreateManyInput[]
  }

  /**
   * GoodsReceipt createManyAndReturn
   */
  export type GoodsReceiptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoodsReceipt
     */
    select?: GoodsReceiptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GoodsReceipts.
     */
    data: GoodsReceiptCreateManyInput | GoodsReceiptCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsReceiptIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GoodsReceipt update
   */
  export type GoodsReceiptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoodsReceipt
     */
    select?: GoodsReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsReceiptInclude<ExtArgs> | null
    /**
     * The data needed to update a GoodsReceipt.
     */
    data: XOR<GoodsReceiptUpdateInput, GoodsReceiptUncheckedUpdateInput>
    /**
     * Choose, which GoodsReceipt to update.
     */
    where: GoodsReceiptWhereUniqueInput
  }

  /**
   * GoodsReceipt updateMany
   */
  export type GoodsReceiptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GoodsReceipts.
     */
    data: XOR<GoodsReceiptUpdateManyMutationInput, GoodsReceiptUncheckedUpdateManyInput>
    /**
     * Filter which GoodsReceipts to update
     */
    where?: GoodsReceiptWhereInput
  }

  /**
   * GoodsReceipt upsert
   */
  export type GoodsReceiptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoodsReceipt
     */
    select?: GoodsReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsReceiptInclude<ExtArgs> | null
    /**
     * The filter to search for the GoodsReceipt to update in case it exists.
     */
    where: GoodsReceiptWhereUniqueInput
    /**
     * In case the GoodsReceipt found by the `where` argument doesn't exist, create a new GoodsReceipt with this data.
     */
    create: XOR<GoodsReceiptCreateInput, GoodsReceiptUncheckedCreateInput>
    /**
     * In case the GoodsReceipt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GoodsReceiptUpdateInput, GoodsReceiptUncheckedUpdateInput>
  }

  /**
   * GoodsReceipt delete
   */
  export type GoodsReceiptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoodsReceipt
     */
    select?: GoodsReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsReceiptInclude<ExtArgs> | null
    /**
     * Filter which GoodsReceipt to delete.
     */
    where: GoodsReceiptWhereUniqueInput
  }

  /**
   * GoodsReceipt deleteMany
   */
  export type GoodsReceiptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GoodsReceipts to delete
     */
    where?: GoodsReceiptWhereInput
  }

  /**
   * GoodsReceipt without action
   */
  export type GoodsReceiptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoodsReceipt
     */
    select?: GoodsReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsReceiptInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
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

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ClientProfileScalarFieldEnum: {
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

  export type ClientProfileScalarFieldEnum = (typeof ClientProfileScalarFieldEnum)[keyof typeof ClientProfileScalarFieldEnum]


  export const RecipeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    clientProfileId: 'clientProfileId',
    lotesMandatory: 'lotesMandatory',
    quantitiesMandatory: 'quantitiesMandatory',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RecipeScalarFieldEnum = (typeof RecipeScalarFieldEnum)[keyof typeof RecipeScalarFieldEnum]


  export const IngredientScalarFieldEnum: {
    id: 'id',
    recipeId: 'recipeId',
    name: 'name',
    amount: 'amount',
    unit: 'unit',
    loteMandatory: 'loteMandatory',
    quantityMandatory: 'quantityMandatory',
    createdAt: 'createdAt'
  };

  export type IngredientScalarFieldEnum = (typeof IngredientScalarFieldEnum)[keyof typeof IngredientScalarFieldEnum]


  export const ElaborationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    date: 'date',
    recipeId: 'recipeId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ElaborationScalarFieldEnum = (typeof ElaborationScalarFieldEnum)[keyof typeof ElaborationScalarFieldEnum]


  export const ElaborationIngredientScalarFieldEnum: {
    id: 'id',
    elaborationId: 'elaborationId',
    name: 'name',
    lote: 'lote',
    realAmount: 'realAmount',
    unit: 'unit',
    createdAt: 'createdAt'
  };

  export type ElaborationIngredientScalarFieldEnum = (typeof ElaborationIngredientScalarFieldEnum)[keyof typeof ElaborationIngredientScalarFieldEnum]


  export const CleaningZoneScalarFieldEnum: {
    id: 'id',
    name: 'name',
    clientProfileId: 'clientProfileId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CleaningZoneScalarFieldEnum = (typeof CleaningZoneScalarFieldEnum)[keyof typeof CleaningZoneScalarFieldEnum]


  export const CleaningLogScalarFieldEnum: {
    id: 'id',
    personName: 'personName',
    date: 'date',
    clientProfileId: 'clientProfileId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CleaningLogScalarFieldEnum = (typeof CleaningLogScalarFieldEnum)[keyof typeof CleaningLogScalarFieldEnum]


  export const CleaningLogZoneScalarFieldEnum: {
    cleaningLogId: 'cleaningLogId',
    cleaningZoneId: 'cleaningZoneId'
  };

  export type CleaningLogZoneScalarFieldEnum = (typeof CleaningLogZoneScalarFieldEnum)[keyof typeof CleaningLogZoneScalarFieldEnum]


  export const ChamberScalarFieldEnum: {
    id: 'id',
    name: 'name',
    clientProfileId: 'clientProfileId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ChamberScalarFieldEnum = (typeof ChamberScalarFieldEnum)[keyof typeof ChamberScalarFieldEnum]


  export const TemperatureRecordScalarFieldEnum: {
    id: 'id',
    date: 'date',
    clientProfileId: 'clientProfileId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TemperatureRecordScalarFieldEnum = (typeof TemperatureRecordScalarFieldEnum)[keyof typeof TemperatureRecordScalarFieldEnum]


  export const TemperatureValueScalarFieldEnum: {
    id: 'id',
    value: 'value',
    chamberId: 'chamberId',
    temperatureRecordId: 'temperatureRecordId'
  };

  export type TemperatureValueScalarFieldEnum = (typeof TemperatureValueScalarFieldEnum)[keyof typeof TemperatureValueScalarFieldEnum]


  export const GoodsReceiptScalarFieldEnum: {
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

  export type GoodsReceiptScalarFieldEnum = (typeof GoodsReceiptScalarFieldEnum)[keyof typeof GoodsReceiptScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    verificationToken?: StringNullableFilter<"User"> | string | null
    verificationTokenExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    resetPasswordToken?: StringNullableFilter<"User"> | string | null
    resetPasswordExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    clientProfile?: XOR<ClientProfileNullableRelationFilter, ClientProfileWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    emailVerified?: SortOrder
    verificationToken?: SortOrderInput | SortOrder
    verificationTokenExpires?: SortOrderInput | SortOrder
    resetPasswordToken?: SortOrderInput | SortOrder
    resetPasswordExpires?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clientProfile?: ClientProfileOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    verificationToken?: StringNullableFilter<"User"> | string | null
    verificationTokenExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    resetPasswordToken?: StringNullableFilter<"User"> | string | null
    resetPasswordExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    clientProfile?: XOR<ClientProfileNullableRelationFilter, ClientProfileWhereInput> | null
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    emailVerified?: SortOrder
    verificationToken?: SortOrderInput | SortOrder
    verificationTokenExpires?: SortOrderInput | SortOrder
    resetPasswordToken?: SortOrderInput | SortOrder
    resetPasswordExpires?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    verificationToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    verificationTokenExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    resetPasswordToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    resetPasswordExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ClientProfileWhereInput = {
    AND?: ClientProfileWhereInput | ClientProfileWhereInput[]
    OR?: ClientProfileWhereInput[]
    NOT?: ClientProfileWhereInput | ClientProfileWhereInput[]
    id?: IntFilter<"ClientProfile"> | number
    userId?: IntFilter<"ClientProfile"> | number
    razonSocial?: StringFilter<"ClientProfile"> | string
    nif?: StringFilter<"ClientProfile"> | string
    phone?: StringNullableFilter<"ClientProfile"> | string | null
    urlClientify?: StringNullableFilter<"ClientProfile"> | string | null
    accountType?: StringFilter<"ClientProfile"> | string
    recetasContratadas?: IntFilter<"ClientProfile"> | number
    canManageRecipes?: BoolFilter<"ClientProfile"> | boolean
    createdAt?: DateTimeFilter<"ClientProfile"> | Date | string
    updatedAt?: DateTimeFilter<"ClientProfile"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    recipes?: RecipeListRelationFilter
    cleaningZones?: CleaningZoneListRelationFilter
    cleaningLogs?: CleaningLogListRelationFilter
    chambers?: ChamberListRelationFilter
    temperatureRecords?: TemperatureRecordListRelationFilter
    goodsReceipts?: GoodsReceiptListRelationFilter
  }

  export type ClientProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    razonSocial?: SortOrder
    nif?: SortOrder
    phone?: SortOrderInput | SortOrder
    urlClientify?: SortOrderInput | SortOrder
    accountType?: SortOrder
    recetasContratadas?: SortOrder
    canManageRecipes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    recipes?: RecipeOrderByRelationAggregateInput
    cleaningZones?: CleaningZoneOrderByRelationAggregateInput
    cleaningLogs?: CleaningLogOrderByRelationAggregateInput
    chambers?: ChamberOrderByRelationAggregateInput
    temperatureRecords?: TemperatureRecordOrderByRelationAggregateInput
    goodsReceipts?: GoodsReceiptOrderByRelationAggregateInput
  }

  export type ClientProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId?: number
    AND?: ClientProfileWhereInput | ClientProfileWhereInput[]
    OR?: ClientProfileWhereInput[]
    NOT?: ClientProfileWhereInput | ClientProfileWhereInput[]
    razonSocial?: StringFilter<"ClientProfile"> | string
    nif?: StringFilter<"ClientProfile"> | string
    phone?: StringNullableFilter<"ClientProfile"> | string | null
    urlClientify?: StringNullableFilter<"ClientProfile"> | string | null
    accountType?: StringFilter<"ClientProfile"> | string
    recetasContratadas?: IntFilter<"ClientProfile"> | number
    canManageRecipes?: BoolFilter<"ClientProfile"> | boolean
    createdAt?: DateTimeFilter<"ClientProfile"> | Date | string
    updatedAt?: DateTimeFilter<"ClientProfile"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    recipes?: RecipeListRelationFilter
    cleaningZones?: CleaningZoneListRelationFilter
    cleaningLogs?: CleaningLogListRelationFilter
    chambers?: ChamberListRelationFilter
    temperatureRecords?: TemperatureRecordListRelationFilter
    goodsReceipts?: GoodsReceiptListRelationFilter
  }, "id" | "userId">

  export type ClientProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    razonSocial?: SortOrder
    nif?: SortOrder
    phone?: SortOrderInput | SortOrder
    urlClientify?: SortOrderInput | SortOrder
    accountType?: SortOrder
    recetasContratadas?: SortOrder
    canManageRecipes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClientProfileCountOrderByAggregateInput
    _avg?: ClientProfileAvgOrderByAggregateInput
    _max?: ClientProfileMaxOrderByAggregateInput
    _min?: ClientProfileMinOrderByAggregateInput
    _sum?: ClientProfileSumOrderByAggregateInput
  }

  export type ClientProfileScalarWhereWithAggregatesInput = {
    AND?: ClientProfileScalarWhereWithAggregatesInput | ClientProfileScalarWhereWithAggregatesInput[]
    OR?: ClientProfileScalarWhereWithAggregatesInput[]
    NOT?: ClientProfileScalarWhereWithAggregatesInput | ClientProfileScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ClientProfile"> | number
    userId?: IntWithAggregatesFilter<"ClientProfile"> | number
    razonSocial?: StringWithAggregatesFilter<"ClientProfile"> | string
    nif?: StringWithAggregatesFilter<"ClientProfile"> | string
    phone?: StringNullableWithAggregatesFilter<"ClientProfile"> | string | null
    urlClientify?: StringNullableWithAggregatesFilter<"ClientProfile"> | string | null
    accountType?: StringWithAggregatesFilter<"ClientProfile"> | string
    recetasContratadas?: IntWithAggregatesFilter<"ClientProfile"> | number
    canManageRecipes?: BoolWithAggregatesFilter<"ClientProfile"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ClientProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ClientProfile"> | Date | string
  }

  export type RecipeWhereInput = {
    AND?: RecipeWhereInput | RecipeWhereInput[]
    OR?: RecipeWhereInput[]
    NOT?: RecipeWhereInput | RecipeWhereInput[]
    id?: IntFilter<"Recipe"> | number
    name?: StringFilter<"Recipe"> | string
    clientProfileId?: IntFilter<"Recipe"> | number
    lotesMandatory?: BoolFilter<"Recipe"> | boolean
    quantitiesMandatory?: BoolFilter<"Recipe"> | boolean
    createdAt?: DateTimeFilter<"Recipe"> | Date | string
    updatedAt?: DateTimeFilter<"Recipe"> | Date | string
    clientProfile?: XOR<ClientProfileRelationFilter, ClientProfileWhereInput>
    ingredients?: IngredientListRelationFilter
    elaborations?: ElaborationListRelationFilter
  }

  export type RecipeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    clientProfileId?: SortOrder
    lotesMandatory?: SortOrder
    quantitiesMandatory?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clientProfile?: ClientProfileOrderByWithRelationInput
    ingredients?: IngredientOrderByRelationAggregateInput
    elaborations?: ElaborationOrderByRelationAggregateInput
  }

  export type RecipeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RecipeWhereInput | RecipeWhereInput[]
    OR?: RecipeWhereInput[]
    NOT?: RecipeWhereInput | RecipeWhereInput[]
    name?: StringFilter<"Recipe"> | string
    clientProfileId?: IntFilter<"Recipe"> | number
    lotesMandatory?: BoolFilter<"Recipe"> | boolean
    quantitiesMandatory?: BoolFilter<"Recipe"> | boolean
    createdAt?: DateTimeFilter<"Recipe"> | Date | string
    updatedAt?: DateTimeFilter<"Recipe"> | Date | string
    clientProfile?: XOR<ClientProfileRelationFilter, ClientProfileWhereInput>
    ingredients?: IngredientListRelationFilter
    elaborations?: ElaborationListRelationFilter
  }, "id">

  export type RecipeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    clientProfileId?: SortOrder
    lotesMandatory?: SortOrder
    quantitiesMandatory?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RecipeCountOrderByAggregateInput
    _avg?: RecipeAvgOrderByAggregateInput
    _max?: RecipeMaxOrderByAggregateInput
    _min?: RecipeMinOrderByAggregateInput
    _sum?: RecipeSumOrderByAggregateInput
  }

  export type RecipeScalarWhereWithAggregatesInput = {
    AND?: RecipeScalarWhereWithAggregatesInput | RecipeScalarWhereWithAggregatesInput[]
    OR?: RecipeScalarWhereWithAggregatesInput[]
    NOT?: RecipeScalarWhereWithAggregatesInput | RecipeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Recipe"> | number
    name?: StringWithAggregatesFilter<"Recipe"> | string
    clientProfileId?: IntWithAggregatesFilter<"Recipe"> | number
    lotesMandatory?: BoolWithAggregatesFilter<"Recipe"> | boolean
    quantitiesMandatory?: BoolWithAggregatesFilter<"Recipe"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Recipe"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Recipe"> | Date | string
  }

  export type IngredientWhereInput = {
    AND?: IngredientWhereInput | IngredientWhereInput[]
    OR?: IngredientWhereInput[]
    NOT?: IngredientWhereInput | IngredientWhereInput[]
    id?: IntFilter<"Ingredient"> | number
    recipeId?: IntFilter<"Ingredient"> | number
    name?: StringFilter<"Ingredient"> | string
    amount?: StringFilter<"Ingredient"> | string
    unit?: StringFilter<"Ingredient"> | string
    loteMandatory?: BoolFilter<"Ingredient"> | boolean
    quantityMandatory?: BoolFilter<"Ingredient"> | boolean
    createdAt?: DateTimeFilter<"Ingredient"> | Date | string
    recipe?: XOR<RecipeRelationFilter, RecipeWhereInput>
  }

  export type IngredientOrderByWithRelationInput = {
    id?: SortOrder
    recipeId?: SortOrder
    name?: SortOrder
    amount?: SortOrder
    unit?: SortOrder
    loteMandatory?: SortOrder
    quantityMandatory?: SortOrder
    createdAt?: SortOrder
    recipe?: RecipeOrderByWithRelationInput
  }

  export type IngredientWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: IngredientWhereInput | IngredientWhereInput[]
    OR?: IngredientWhereInput[]
    NOT?: IngredientWhereInput | IngredientWhereInput[]
    recipeId?: IntFilter<"Ingredient"> | number
    name?: StringFilter<"Ingredient"> | string
    amount?: StringFilter<"Ingredient"> | string
    unit?: StringFilter<"Ingredient"> | string
    loteMandatory?: BoolFilter<"Ingredient"> | boolean
    quantityMandatory?: BoolFilter<"Ingredient"> | boolean
    createdAt?: DateTimeFilter<"Ingredient"> | Date | string
    recipe?: XOR<RecipeRelationFilter, RecipeWhereInput>
  }, "id">

  export type IngredientOrderByWithAggregationInput = {
    id?: SortOrder
    recipeId?: SortOrder
    name?: SortOrder
    amount?: SortOrder
    unit?: SortOrder
    loteMandatory?: SortOrder
    quantityMandatory?: SortOrder
    createdAt?: SortOrder
    _count?: IngredientCountOrderByAggregateInput
    _avg?: IngredientAvgOrderByAggregateInput
    _max?: IngredientMaxOrderByAggregateInput
    _min?: IngredientMinOrderByAggregateInput
    _sum?: IngredientSumOrderByAggregateInput
  }

  export type IngredientScalarWhereWithAggregatesInput = {
    AND?: IngredientScalarWhereWithAggregatesInput | IngredientScalarWhereWithAggregatesInput[]
    OR?: IngredientScalarWhereWithAggregatesInput[]
    NOT?: IngredientScalarWhereWithAggregatesInput | IngredientScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Ingredient"> | number
    recipeId?: IntWithAggregatesFilter<"Ingredient"> | number
    name?: StringWithAggregatesFilter<"Ingredient"> | string
    amount?: StringWithAggregatesFilter<"Ingredient"> | string
    unit?: StringWithAggregatesFilter<"Ingredient"> | string
    loteMandatory?: BoolWithAggregatesFilter<"Ingredient"> | boolean
    quantityMandatory?: BoolWithAggregatesFilter<"Ingredient"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Ingredient"> | Date | string
  }

  export type ElaborationWhereInput = {
    AND?: ElaborationWhereInput | ElaborationWhereInput[]
    OR?: ElaborationWhereInput[]
    NOT?: ElaborationWhereInput | ElaborationWhereInput[]
    id?: IntFilter<"Elaboration"> | number
    name?: StringFilter<"Elaboration"> | string
    date?: DateTimeFilter<"Elaboration"> | Date | string
    recipeId?: IntFilter<"Elaboration"> | number
    createdAt?: DateTimeFilter<"Elaboration"> | Date | string
    updatedAt?: DateTimeFilter<"Elaboration"> | Date | string
    recipe?: XOR<RecipeRelationFilter, RecipeWhereInput>
    ingredients?: ElaborationIngredientListRelationFilter
  }

  export type ElaborationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    date?: SortOrder
    recipeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    recipe?: RecipeOrderByWithRelationInput
    ingredients?: ElaborationIngredientOrderByRelationAggregateInput
  }

  export type ElaborationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ElaborationWhereInput | ElaborationWhereInput[]
    OR?: ElaborationWhereInput[]
    NOT?: ElaborationWhereInput | ElaborationWhereInput[]
    name?: StringFilter<"Elaboration"> | string
    date?: DateTimeFilter<"Elaboration"> | Date | string
    recipeId?: IntFilter<"Elaboration"> | number
    createdAt?: DateTimeFilter<"Elaboration"> | Date | string
    updatedAt?: DateTimeFilter<"Elaboration"> | Date | string
    recipe?: XOR<RecipeRelationFilter, RecipeWhereInput>
    ingredients?: ElaborationIngredientListRelationFilter
  }, "id">

  export type ElaborationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    date?: SortOrder
    recipeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ElaborationCountOrderByAggregateInput
    _avg?: ElaborationAvgOrderByAggregateInput
    _max?: ElaborationMaxOrderByAggregateInput
    _min?: ElaborationMinOrderByAggregateInput
    _sum?: ElaborationSumOrderByAggregateInput
  }

  export type ElaborationScalarWhereWithAggregatesInput = {
    AND?: ElaborationScalarWhereWithAggregatesInput | ElaborationScalarWhereWithAggregatesInput[]
    OR?: ElaborationScalarWhereWithAggregatesInput[]
    NOT?: ElaborationScalarWhereWithAggregatesInput | ElaborationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Elaboration"> | number
    name?: StringWithAggregatesFilter<"Elaboration"> | string
    date?: DateTimeWithAggregatesFilter<"Elaboration"> | Date | string
    recipeId?: IntWithAggregatesFilter<"Elaboration"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Elaboration"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Elaboration"> | Date | string
  }

  export type ElaborationIngredientWhereInput = {
    AND?: ElaborationIngredientWhereInput | ElaborationIngredientWhereInput[]
    OR?: ElaborationIngredientWhereInput[]
    NOT?: ElaborationIngredientWhereInput | ElaborationIngredientWhereInput[]
    id?: IntFilter<"ElaborationIngredient"> | number
    elaborationId?: IntFilter<"ElaborationIngredient"> | number
    name?: StringFilter<"ElaborationIngredient"> | string
    lote?: StringNullableFilter<"ElaborationIngredient"> | string | null
    realAmount?: StringFilter<"ElaborationIngredient"> | string
    unit?: StringFilter<"ElaborationIngredient"> | string
    createdAt?: DateTimeFilter<"ElaborationIngredient"> | Date | string
    elaboration?: XOR<ElaborationRelationFilter, ElaborationWhereInput>
  }

  export type ElaborationIngredientOrderByWithRelationInput = {
    id?: SortOrder
    elaborationId?: SortOrder
    name?: SortOrder
    lote?: SortOrderInput | SortOrder
    realAmount?: SortOrder
    unit?: SortOrder
    createdAt?: SortOrder
    elaboration?: ElaborationOrderByWithRelationInput
  }

  export type ElaborationIngredientWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ElaborationIngredientWhereInput | ElaborationIngredientWhereInput[]
    OR?: ElaborationIngredientWhereInput[]
    NOT?: ElaborationIngredientWhereInput | ElaborationIngredientWhereInput[]
    elaborationId?: IntFilter<"ElaborationIngredient"> | number
    name?: StringFilter<"ElaborationIngredient"> | string
    lote?: StringNullableFilter<"ElaborationIngredient"> | string | null
    realAmount?: StringFilter<"ElaborationIngredient"> | string
    unit?: StringFilter<"ElaborationIngredient"> | string
    createdAt?: DateTimeFilter<"ElaborationIngredient"> | Date | string
    elaboration?: XOR<ElaborationRelationFilter, ElaborationWhereInput>
  }, "id">

  export type ElaborationIngredientOrderByWithAggregationInput = {
    id?: SortOrder
    elaborationId?: SortOrder
    name?: SortOrder
    lote?: SortOrderInput | SortOrder
    realAmount?: SortOrder
    unit?: SortOrder
    createdAt?: SortOrder
    _count?: ElaborationIngredientCountOrderByAggregateInput
    _avg?: ElaborationIngredientAvgOrderByAggregateInput
    _max?: ElaborationIngredientMaxOrderByAggregateInput
    _min?: ElaborationIngredientMinOrderByAggregateInput
    _sum?: ElaborationIngredientSumOrderByAggregateInput
  }

  export type ElaborationIngredientScalarWhereWithAggregatesInput = {
    AND?: ElaborationIngredientScalarWhereWithAggregatesInput | ElaborationIngredientScalarWhereWithAggregatesInput[]
    OR?: ElaborationIngredientScalarWhereWithAggregatesInput[]
    NOT?: ElaborationIngredientScalarWhereWithAggregatesInput | ElaborationIngredientScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ElaborationIngredient"> | number
    elaborationId?: IntWithAggregatesFilter<"ElaborationIngredient"> | number
    name?: StringWithAggregatesFilter<"ElaborationIngredient"> | string
    lote?: StringNullableWithAggregatesFilter<"ElaborationIngredient"> | string | null
    realAmount?: StringWithAggregatesFilter<"ElaborationIngredient"> | string
    unit?: StringWithAggregatesFilter<"ElaborationIngredient"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ElaborationIngredient"> | Date | string
  }

  export type CleaningZoneWhereInput = {
    AND?: CleaningZoneWhereInput | CleaningZoneWhereInput[]
    OR?: CleaningZoneWhereInput[]
    NOT?: CleaningZoneWhereInput | CleaningZoneWhereInput[]
    id?: IntFilter<"CleaningZone"> | number
    name?: StringFilter<"CleaningZone"> | string
    clientProfileId?: IntFilter<"CleaningZone"> | number
    createdAt?: DateTimeFilter<"CleaningZone"> | Date | string
    updatedAt?: DateTimeFilter<"CleaningZone"> | Date | string
    clientProfile?: XOR<ClientProfileRelationFilter, ClientProfileWhereInput>
    logs?: CleaningLogZoneListRelationFilter
  }

  export type CleaningZoneOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clientProfile?: ClientProfileOrderByWithRelationInput
    logs?: CleaningLogZoneOrderByRelationAggregateInput
  }

  export type CleaningZoneWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CleaningZoneWhereInput | CleaningZoneWhereInput[]
    OR?: CleaningZoneWhereInput[]
    NOT?: CleaningZoneWhereInput | CleaningZoneWhereInput[]
    name?: StringFilter<"CleaningZone"> | string
    clientProfileId?: IntFilter<"CleaningZone"> | number
    createdAt?: DateTimeFilter<"CleaningZone"> | Date | string
    updatedAt?: DateTimeFilter<"CleaningZone"> | Date | string
    clientProfile?: XOR<ClientProfileRelationFilter, ClientProfileWhereInput>
    logs?: CleaningLogZoneListRelationFilter
  }, "id">

  export type CleaningZoneOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CleaningZoneCountOrderByAggregateInput
    _avg?: CleaningZoneAvgOrderByAggregateInput
    _max?: CleaningZoneMaxOrderByAggregateInput
    _min?: CleaningZoneMinOrderByAggregateInput
    _sum?: CleaningZoneSumOrderByAggregateInput
  }

  export type CleaningZoneScalarWhereWithAggregatesInput = {
    AND?: CleaningZoneScalarWhereWithAggregatesInput | CleaningZoneScalarWhereWithAggregatesInput[]
    OR?: CleaningZoneScalarWhereWithAggregatesInput[]
    NOT?: CleaningZoneScalarWhereWithAggregatesInput | CleaningZoneScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CleaningZone"> | number
    name?: StringWithAggregatesFilter<"CleaningZone"> | string
    clientProfileId?: IntWithAggregatesFilter<"CleaningZone"> | number
    createdAt?: DateTimeWithAggregatesFilter<"CleaningZone"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CleaningZone"> | Date | string
  }

  export type CleaningLogWhereInput = {
    AND?: CleaningLogWhereInput | CleaningLogWhereInput[]
    OR?: CleaningLogWhereInput[]
    NOT?: CleaningLogWhereInput | CleaningLogWhereInput[]
    id?: IntFilter<"CleaningLog"> | number
    personName?: StringFilter<"CleaningLog"> | string
    date?: DateTimeFilter<"CleaningLog"> | Date | string
    clientProfileId?: IntFilter<"CleaningLog"> | number
    createdAt?: DateTimeFilter<"CleaningLog"> | Date | string
    updatedAt?: DateTimeFilter<"CleaningLog"> | Date | string
    clientProfile?: XOR<ClientProfileRelationFilter, ClientProfileWhereInput>
    zones?: CleaningLogZoneListRelationFilter
  }

  export type CleaningLogOrderByWithRelationInput = {
    id?: SortOrder
    personName?: SortOrder
    date?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clientProfile?: ClientProfileOrderByWithRelationInput
    zones?: CleaningLogZoneOrderByRelationAggregateInput
  }

  export type CleaningLogWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CleaningLogWhereInput | CleaningLogWhereInput[]
    OR?: CleaningLogWhereInput[]
    NOT?: CleaningLogWhereInput | CleaningLogWhereInput[]
    personName?: StringFilter<"CleaningLog"> | string
    date?: DateTimeFilter<"CleaningLog"> | Date | string
    clientProfileId?: IntFilter<"CleaningLog"> | number
    createdAt?: DateTimeFilter<"CleaningLog"> | Date | string
    updatedAt?: DateTimeFilter<"CleaningLog"> | Date | string
    clientProfile?: XOR<ClientProfileRelationFilter, ClientProfileWhereInput>
    zones?: CleaningLogZoneListRelationFilter
  }, "id">

  export type CleaningLogOrderByWithAggregationInput = {
    id?: SortOrder
    personName?: SortOrder
    date?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CleaningLogCountOrderByAggregateInput
    _avg?: CleaningLogAvgOrderByAggregateInput
    _max?: CleaningLogMaxOrderByAggregateInput
    _min?: CleaningLogMinOrderByAggregateInput
    _sum?: CleaningLogSumOrderByAggregateInput
  }

  export type CleaningLogScalarWhereWithAggregatesInput = {
    AND?: CleaningLogScalarWhereWithAggregatesInput | CleaningLogScalarWhereWithAggregatesInput[]
    OR?: CleaningLogScalarWhereWithAggregatesInput[]
    NOT?: CleaningLogScalarWhereWithAggregatesInput | CleaningLogScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CleaningLog"> | number
    personName?: StringWithAggregatesFilter<"CleaningLog"> | string
    date?: DateTimeWithAggregatesFilter<"CleaningLog"> | Date | string
    clientProfileId?: IntWithAggregatesFilter<"CleaningLog"> | number
    createdAt?: DateTimeWithAggregatesFilter<"CleaningLog"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CleaningLog"> | Date | string
  }

  export type CleaningLogZoneWhereInput = {
    AND?: CleaningLogZoneWhereInput | CleaningLogZoneWhereInput[]
    OR?: CleaningLogZoneWhereInput[]
    NOT?: CleaningLogZoneWhereInput | CleaningLogZoneWhereInput[]
    cleaningLogId?: IntFilter<"CleaningLogZone"> | number
    cleaningZoneId?: IntFilter<"CleaningLogZone"> | number
    cleaningLog?: XOR<CleaningLogRelationFilter, CleaningLogWhereInput>
    cleaningZone?: XOR<CleaningZoneRelationFilter, CleaningZoneWhereInput>
  }

  export type CleaningLogZoneOrderByWithRelationInput = {
    cleaningLogId?: SortOrder
    cleaningZoneId?: SortOrder
    cleaningLog?: CleaningLogOrderByWithRelationInput
    cleaningZone?: CleaningZoneOrderByWithRelationInput
  }

  export type CleaningLogZoneWhereUniqueInput = Prisma.AtLeast<{
    cleaningLogId_cleaningZoneId?: CleaningLogZoneCleaningLogIdCleaningZoneIdCompoundUniqueInput
    AND?: CleaningLogZoneWhereInput | CleaningLogZoneWhereInput[]
    OR?: CleaningLogZoneWhereInput[]
    NOT?: CleaningLogZoneWhereInput | CleaningLogZoneWhereInput[]
    cleaningLogId?: IntFilter<"CleaningLogZone"> | number
    cleaningZoneId?: IntFilter<"CleaningLogZone"> | number
    cleaningLog?: XOR<CleaningLogRelationFilter, CleaningLogWhereInput>
    cleaningZone?: XOR<CleaningZoneRelationFilter, CleaningZoneWhereInput>
  }, "cleaningLogId_cleaningZoneId">

  export type CleaningLogZoneOrderByWithAggregationInput = {
    cleaningLogId?: SortOrder
    cleaningZoneId?: SortOrder
    _count?: CleaningLogZoneCountOrderByAggregateInput
    _avg?: CleaningLogZoneAvgOrderByAggregateInput
    _max?: CleaningLogZoneMaxOrderByAggregateInput
    _min?: CleaningLogZoneMinOrderByAggregateInput
    _sum?: CleaningLogZoneSumOrderByAggregateInput
  }

  export type CleaningLogZoneScalarWhereWithAggregatesInput = {
    AND?: CleaningLogZoneScalarWhereWithAggregatesInput | CleaningLogZoneScalarWhereWithAggregatesInput[]
    OR?: CleaningLogZoneScalarWhereWithAggregatesInput[]
    NOT?: CleaningLogZoneScalarWhereWithAggregatesInput | CleaningLogZoneScalarWhereWithAggregatesInput[]
    cleaningLogId?: IntWithAggregatesFilter<"CleaningLogZone"> | number
    cleaningZoneId?: IntWithAggregatesFilter<"CleaningLogZone"> | number
  }

  export type ChamberWhereInput = {
    AND?: ChamberWhereInput | ChamberWhereInput[]
    OR?: ChamberWhereInput[]
    NOT?: ChamberWhereInput | ChamberWhereInput[]
    id?: IntFilter<"Chamber"> | number
    name?: StringFilter<"Chamber"> | string
    clientProfileId?: IntFilter<"Chamber"> | number
    createdAt?: DateTimeFilter<"Chamber"> | Date | string
    updatedAt?: DateTimeFilter<"Chamber"> | Date | string
    clientProfile?: XOR<ClientProfileRelationFilter, ClientProfileWhereInput>
    values?: TemperatureValueListRelationFilter
  }

  export type ChamberOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clientProfile?: ClientProfileOrderByWithRelationInput
    values?: TemperatureValueOrderByRelationAggregateInput
  }

  export type ChamberWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ChamberWhereInput | ChamberWhereInput[]
    OR?: ChamberWhereInput[]
    NOT?: ChamberWhereInput | ChamberWhereInput[]
    name?: StringFilter<"Chamber"> | string
    clientProfileId?: IntFilter<"Chamber"> | number
    createdAt?: DateTimeFilter<"Chamber"> | Date | string
    updatedAt?: DateTimeFilter<"Chamber"> | Date | string
    clientProfile?: XOR<ClientProfileRelationFilter, ClientProfileWhereInput>
    values?: TemperatureValueListRelationFilter
  }, "id">

  export type ChamberOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChamberCountOrderByAggregateInput
    _avg?: ChamberAvgOrderByAggregateInput
    _max?: ChamberMaxOrderByAggregateInput
    _min?: ChamberMinOrderByAggregateInput
    _sum?: ChamberSumOrderByAggregateInput
  }

  export type ChamberScalarWhereWithAggregatesInput = {
    AND?: ChamberScalarWhereWithAggregatesInput | ChamberScalarWhereWithAggregatesInput[]
    OR?: ChamberScalarWhereWithAggregatesInput[]
    NOT?: ChamberScalarWhereWithAggregatesInput | ChamberScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Chamber"> | number
    name?: StringWithAggregatesFilter<"Chamber"> | string
    clientProfileId?: IntWithAggregatesFilter<"Chamber"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Chamber"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Chamber"> | Date | string
  }

  export type TemperatureRecordWhereInput = {
    AND?: TemperatureRecordWhereInput | TemperatureRecordWhereInput[]
    OR?: TemperatureRecordWhereInput[]
    NOT?: TemperatureRecordWhereInput | TemperatureRecordWhereInput[]
    id?: IntFilter<"TemperatureRecord"> | number
    date?: DateTimeFilter<"TemperatureRecord"> | Date | string
    clientProfileId?: IntFilter<"TemperatureRecord"> | number
    createdAt?: DateTimeFilter<"TemperatureRecord"> | Date | string
    updatedAt?: DateTimeFilter<"TemperatureRecord"> | Date | string
    clientProfile?: XOR<ClientProfileRelationFilter, ClientProfileWhereInput>
    values?: TemperatureValueListRelationFilter
  }

  export type TemperatureRecordOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clientProfile?: ClientProfileOrderByWithRelationInput
    values?: TemperatureValueOrderByRelationAggregateInput
  }

  export type TemperatureRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TemperatureRecordWhereInput | TemperatureRecordWhereInput[]
    OR?: TemperatureRecordWhereInput[]
    NOT?: TemperatureRecordWhereInput | TemperatureRecordWhereInput[]
    date?: DateTimeFilter<"TemperatureRecord"> | Date | string
    clientProfileId?: IntFilter<"TemperatureRecord"> | number
    createdAt?: DateTimeFilter<"TemperatureRecord"> | Date | string
    updatedAt?: DateTimeFilter<"TemperatureRecord"> | Date | string
    clientProfile?: XOR<ClientProfileRelationFilter, ClientProfileWhereInput>
    values?: TemperatureValueListRelationFilter
  }, "id">

  export type TemperatureRecordOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TemperatureRecordCountOrderByAggregateInput
    _avg?: TemperatureRecordAvgOrderByAggregateInput
    _max?: TemperatureRecordMaxOrderByAggregateInput
    _min?: TemperatureRecordMinOrderByAggregateInput
    _sum?: TemperatureRecordSumOrderByAggregateInput
  }

  export type TemperatureRecordScalarWhereWithAggregatesInput = {
    AND?: TemperatureRecordScalarWhereWithAggregatesInput | TemperatureRecordScalarWhereWithAggregatesInput[]
    OR?: TemperatureRecordScalarWhereWithAggregatesInput[]
    NOT?: TemperatureRecordScalarWhereWithAggregatesInput | TemperatureRecordScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TemperatureRecord"> | number
    date?: DateTimeWithAggregatesFilter<"TemperatureRecord"> | Date | string
    clientProfileId?: IntWithAggregatesFilter<"TemperatureRecord"> | number
    createdAt?: DateTimeWithAggregatesFilter<"TemperatureRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TemperatureRecord"> | Date | string
  }

  export type TemperatureValueWhereInput = {
    AND?: TemperatureValueWhereInput | TemperatureValueWhereInput[]
    OR?: TemperatureValueWhereInput[]
    NOT?: TemperatureValueWhereInput | TemperatureValueWhereInput[]
    id?: IntFilter<"TemperatureValue"> | number
    value?: FloatFilter<"TemperatureValue"> | number
    chamberId?: IntFilter<"TemperatureValue"> | number
    temperatureRecordId?: IntFilter<"TemperatureValue"> | number
    chamber?: XOR<ChamberRelationFilter, ChamberWhereInput>
    record?: XOR<TemperatureRecordRelationFilter, TemperatureRecordWhereInput>
  }

  export type TemperatureValueOrderByWithRelationInput = {
    id?: SortOrder
    value?: SortOrder
    chamberId?: SortOrder
    temperatureRecordId?: SortOrder
    chamber?: ChamberOrderByWithRelationInput
    record?: TemperatureRecordOrderByWithRelationInput
  }

  export type TemperatureValueWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TemperatureValueWhereInput | TemperatureValueWhereInput[]
    OR?: TemperatureValueWhereInput[]
    NOT?: TemperatureValueWhereInput | TemperatureValueWhereInput[]
    value?: FloatFilter<"TemperatureValue"> | number
    chamberId?: IntFilter<"TemperatureValue"> | number
    temperatureRecordId?: IntFilter<"TemperatureValue"> | number
    chamber?: XOR<ChamberRelationFilter, ChamberWhereInput>
    record?: XOR<TemperatureRecordRelationFilter, TemperatureRecordWhereInput>
  }, "id">

  export type TemperatureValueOrderByWithAggregationInput = {
    id?: SortOrder
    value?: SortOrder
    chamberId?: SortOrder
    temperatureRecordId?: SortOrder
    _count?: TemperatureValueCountOrderByAggregateInput
    _avg?: TemperatureValueAvgOrderByAggregateInput
    _max?: TemperatureValueMaxOrderByAggregateInput
    _min?: TemperatureValueMinOrderByAggregateInput
    _sum?: TemperatureValueSumOrderByAggregateInput
  }

  export type TemperatureValueScalarWhereWithAggregatesInput = {
    AND?: TemperatureValueScalarWhereWithAggregatesInput | TemperatureValueScalarWhereWithAggregatesInput[]
    OR?: TemperatureValueScalarWhereWithAggregatesInput[]
    NOT?: TemperatureValueScalarWhereWithAggregatesInput | TemperatureValueScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TemperatureValue"> | number
    value?: FloatWithAggregatesFilter<"TemperatureValue"> | number
    chamberId?: IntWithAggregatesFilter<"TemperatureValue"> | number
    temperatureRecordId?: IntWithAggregatesFilter<"TemperatureValue"> | number
  }

  export type GoodsReceiptWhereInput = {
    AND?: GoodsReceiptWhereInput | GoodsReceiptWhereInput[]
    OR?: GoodsReceiptWhereInput[]
    NOT?: GoodsReceiptWhereInput | GoodsReceiptWhereInput[]
    id?: IntFilter<"GoodsReceipt"> | number
    providerName?: StringNullableFilter<"GoodsReceipt"> | string | null
    productName?: StringFilter<"GoodsReceipt"> | string
    lote?: StringNullableFilter<"GoodsReceipt"> | string | null
    invoiceNumber?: StringNullableFilter<"GoodsReceipt"> | string | null
    quantity?: StringNullableFilter<"GoodsReceipt"> | string | null
    date?: DateTimeFilter<"GoodsReceipt"> | Date | string
    deliveryNoteImage?: StringNullableFilter<"GoodsReceipt"> | string | null
    clientProfileId?: IntFilter<"GoodsReceipt"> | number
    createdAt?: DateTimeFilter<"GoodsReceipt"> | Date | string
    updatedAt?: DateTimeFilter<"GoodsReceipt"> | Date | string
    clientProfile?: XOR<ClientProfileRelationFilter, ClientProfileWhereInput>
  }

  export type GoodsReceiptOrderByWithRelationInput = {
    id?: SortOrder
    providerName?: SortOrderInput | SortOrder
    productName?: SortOrder
    lote?: SortOrderInput | SortOrder
    invoiceNumber?: SortOrderInput | SortOrder
    quantity?: SortOrderInput | SortOrder
    date?: SortOrder
    deliveryNoteImage?: SortOrderInput | SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clientProfile?: ClientProfileOrderByWithRelationInput
  }

  export type GoodsReceiptWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: GoodsReceiptWhereInput | GoodsReceiptWhereInput[]
    OR?: GoodsReceiptWhereInput[]
    NOT?: GoodsReceiptWhereInput | GoodsReceiptWhereInput[]
    providerName?: StringNullableFilter<"GoodsReceipt"> | string | null
    productName?: StringFilter<"GoodsReceipt"> | string
    lote?: StringNullableFilter<"GoodsReceipt"> | string | null
    invoiceNumber?: StringNullableFilter<"GoodsReceipt"> | string | null
    quantity?: StringNullableFilter<"GoodsReceipt"> | string | null
    date?: DateTimeFilter<"GoodsReceipt"> | Date | string
    deliveryNoteImage?: StringNullableFilter<"GoodsReceipt"> | string | null
    clientProfileId?: IntFilter<"GoodsReceipt"> | number
    createdAt?: DateTimeFilter<"GoodsReceipt"> | Date | string
    updatedAt?: DateTimeFilter<"GoodsReceipt"> | Date | string
    clientProfile?: XOR<ClientProfileRelationFilter, ClientProfileWhereInput>
  }, "id">

  export type GoodsReceiptOrderByWithAggregationInput = {
    id?: SortOrder
    providerName?: SortOrderInput | SortOrder
    productName?: SortOrder
    lote?: SortOrderInput | SortOrder
    invoiceNumber?: SortOrderInput | SortOrder
    quantity?: SortOrderInput | SortOrder
    date?: SortOrder
    deliveryNoteImage?: SortOrderInput | SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GoodsReceiptCountOrderByAggregateInput
    _avg?: GoodsReceiptAvgOrderByAggregateInput
    _max?: GoodsReceiptMaxOrderByAggregateInput
    _min?: GoodsReceiptMinOrderByAggregateInput
    _sum?: GoodsReceiptSumOrderByAggregateInput
  }

  export type GoodsReceiptScalarWhereWithAggregatesInput = {
    AND?: GoodsReceiptScalarWhereWithAggregatesInput | GoodsReceiptScalarWhereWithAggregatesInput[]
    OR?: GoodsReceiptScalarWhereWithAggregatesInput[]
    NOT?: GoodsReceiptScalarWhereWithAggregatesInput | GoodsReceiptScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"GoodsReceipt"> | number
    providerName?: StringNullableWithAggregatesFilter<"GoodsReceipt"> | string | null
    productName?: StringWithAggregatesFilter<"GoodsReceipt"> | string
    lote?: StringNullableWithAggregatesFilter<"GoodsReceipt"> | string | null
    invoiceNumber?: StringNullableWithAggregatesFilter<"GoodsReceipt"> | string | null
    quantity?: StringNullableWithAggregatesFilter<"GoodsReceipt"> | string | null
    date?: DateTimeWithAggregatesFilter<"GoodsReceipt"> | Date | string
    deliveryNoteImage?: StringNullableWithAggregatesFilter<"GoodsReceipt"> | string | null
    clientProfileId?: IntWithAggregatesFilter<"GoodsReceipt"> | number
    createdAt?: DateTimeWithAggregatesFilter<"GoodsReceipt"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GoodsReceipt"> | Date | string
  }

  export type UserCreateInput = {
    email: string
    password: string
    name?: string | null
    role?: string
    emailVerified?: boolean
    verificationToken?: string | null
    verificationTokenExpires?: Date | string | null
    resetPasswordToken?: string | null
    resetPasswordExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    clientProfile?: ClientProfileCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    email: string
    password: string
    name?: string | null
    role?: string
    emailVerified?: boolean
    verificationToken?: string | null
    verificationTokenExpires?: Date | string | null
    resetPasswordToken?: string | null
    resetPasswordExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    clientProfile?: ClientProfileUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfile?: ClientProfileUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfile?: ClientProfileUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    email: string
    password: string
    name?: string | null
    role?: string
    emailVerified?: boolean
    verificationToken?: string | null
    verificationTokenExpires?: Date | string | null
    resetPasswordToken?: string | null
    resetPasswordExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientProfileCreateInput = {
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutClientProfileInput
    recipes?: RecipeCreateNestedManyWithoutClientProfileInput
    cleaningZones?: CleaningZoneCreateNestedManyWithoutClientProfileInput
    cleaningLogs?: CleaningLogCreateNestedManyWithoutClientProfileInput
    chambers?: ChamberCreateNestedManyWithoutClientProfileInput
    temperatureRecords?: TemperatureRecordCreateNestedManyWithoutClientProfileInput
    goodsReceipts?: GoodsReceiptCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileUncheckedCreateInput = {
    id?: number
    userId: number
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    recipes?: RecipeUncheckedCreateNestedManyWithoutClientProfileInput
    cleaningZones?: CleaningZoneUncheckedCreateNestedManyWithoutClientProfileInput
    cleaningLogs?: CleaningLogUncheckedCreateNestedManyWithoutClientProfileInput
    chambers?: ChamberUncheckedCreateNestedManyWithoutClientProfileInput
    temperatureRecords?: TemperatureRecordUncheckedCreateNestedManyWithoutClientProfileInput
    goodsReceipts?: GoodsReceiptUncheckedCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileUpdateInput = {
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutClientProfileNestedInput
    recipes?: RecipeUpdateManyWithoutClientProfileNestedInput
    cleaningZones?: CleaningZoneUpdateManyWithoutClientProfileNestedInput
    cleaningLogs?: CleaningLogUpdateManyWithoutClientProfileNestedInput
    chambers?: ChamberUpdateManyWithoutClientProfileNestedInput
    temperatureRecords?: TemperatureRecordUpdateManyWithoutClientProfileNestedInput
    goodsReceipts?: GoodsReceiptUpdateManyWithoutClientProfileNestedInput
  }

  export type ClientProfileUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipes?: RecipeUncheckedUpdateManyWithoutClientProfileNestedInput
    cleaningZones?: CleaningZoneUncheckedUpdateManyWithoutClientProfileNestedInput
    cleaningLogs?: CleaningLogUncheckedUpdateManyWithoutClientProfileNestedInput
    chambers?: ChamberUncheckedUpdateManyWithoutClientProfileNestedInput
    temperatureRecords?: TemperatureRecordUncheckedUpdateManyWithoutClientProfileNestedInput
    goodsReceipts?: GoodsReceiptUncheckedUpdateManyWithoutClientProfileNestedInput
  }

  export type ClientProfileCreateManyInput = {
    id?: number
    userId: number
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClientProfileUpdateManyMutationInput = {
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientProfileUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecipeCreateInput = {
    name: string
    lotesMandatory?: boolean
    quantitiesMandatory?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    clientProfile: ClientProfileCreateNestedOneWithoutRecipesInput
    ingredients?: IngredientCreateNestedManyWithoutRecipeInput
    elaborations?: ElaborationCreateNestedManyWithoutRecipeInput
  }

  export type RecipeUncheckedCreateInput = {
    id?: number
    name: string
    clientProfileId: number
    lotesMandatory?: boolean
    quantitiesMandatory?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    ingredients?: IngredientUncheckedCreateNestedManyWithoutRecipeInput
    elaborations?: ElaborationUncheckedCreateNestedManyWithoutRecipeInput
  }

  export type RecipeUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    lotesMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantitiesMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfile?: ClientProfileUpdateOneRequiredWithoutRecipesNestedInput
    ingredients?: IngredientUpdateManyWithoutRecipeNestedInput
    elaborations?: ElaborationUpdateManyWithoutRecipeNestedInput
  }

  export type RecipeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    lotesMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantitiesMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ingredients?: IngredientUncheckedUpdateManyWithoutRecipeNestedInput
    elaborations?: ElaborationUncheckedUpdateManyWithoutRecipeNestedInput
  }

  export type RecipeCreateManyInput = {
    id?: number
    name: string
    clientProfileId: number
    lotesMandatory?: boolean
    quantitiesMandatory?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RecipeUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    lotesMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantitiesMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecipeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    lotesMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantitiesMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngredientCreateInput = {
    name: string
    amount: string
    unit: string
    loteMandatory?: boolean
    quantityMandatory?: boolean
    createdAt?: Date | string
    recipe: RecipeCreateNestedOneWithoutIngredientsInput
  }

  export type IngredientUncheckedCreateInput = {
    id?: number
    recipeId: number
    name: string
    amount: string
    unit: string
    loteMandatory?: boolean
    quantityMandatory?: boolean
    createdAt?: Date | string
  }

  export type IngredientUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    amount?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    loteMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantityMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipe?: RecipeUpdateOneRequiredWithoutIngredientsNestedInput
  }

  export type IngredientUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    recipeId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    amount?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    loteMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantityMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngredientCreateManyInput = {
    id?: number
    recipeId: number
    name: string
    amount: string
    unit: string
    loteMandatory?: boolean
    quantityMandatory?: boolean
    createdAt?: Date | string
  }

  export type IngredientUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    amount?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    loteMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantityMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngredientUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    recipeId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    amount?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    loteMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantityMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ElaborationCreateInput = {
    name: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    recipe: RecipeCreateNestedOneWithoutElaborationsInput
    ingredients?: ElaborationIngredientCreateNestedManyWithoutElaborationInput
  }

  export type ElaborationUncheckedCreateInput = {
    id?: number
    name: string
    date?: Date | string
    recipeId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ingredients?: ElaborationIngredientUncheckedCreateNestedManyWithoutElaborationInput
  }

  export type ElaborationUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipe?: RecipeUpdateOneRequiredWithoutElaborationsNestedInput
    ingredients?: ElaborationIngredientUpdateManyWithoutElaborationNestedInput
  }

  export type ElaborationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    recipeId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ingredients?: ElaborationIngredientUncheckedUpdateManyWithoutElaborationNestedInput
  }

  export type ElaborationCreateManyInput = {
    id?: number
    name: string
    date?: Date | string
    recipeId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ElaborationUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ElaborationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    recipeId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ElaborationIngredientCreateInput = {
    name: string
    lote?: string | null
    realAmount: string
    unit: string
    createdAt?: Date | string
    elaboration: ElaborationCreateNestedOneWithoutIngredientsInput
  }

  export type ElaborationIngredientUncheckedCreateInput = {
    id?: number
    elaborationId: number
    name: string
    lote?: string | null
    realAmount: string
    unit: string
    createdAt?: Date | string
  }

  export type ElaborationIngredientUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    realAmount?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    elaboration?: ElaborationUpdateOneRequiredWithoutIngredientsNestedInput
  }

  export type ElaborationIngredientUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    elaborationId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    realAmount?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ElaborationIngredientCreateManyInput = {
    id?: number
    elaborationId: number
    name: string
    lote?: string | null
    realAmount: string
    unit: string
    createdAt?: Date | string
  }

  export type ElaborationIngredientUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    realAmount?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ElaborationIngredientUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    elaborationId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    realAmount?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CleaningZoneCreateInput = {
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    clientProfile: ClientProfileCreateNestedOneWithoutCleaningZonesInput
    logs?: CleaningLogZoneCreateNestedManyWithoutCleaningZoneInput
  }

  export type CleaningZoneUncheckedCreateInput = {
    id?: number
    name: string
    clientProfileId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    logs?: CleaningLogZoneUncheckedCreateNestedManyWithoutCleaningZoneInput
  }

  export type CleaningZoneUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfile?: ClientProfileUpdateOneRequiredWithoutCleaningZonesNestedInput
    logs?: CleaningLogZoneUpdateManyWithoutCleaningZoneNestedInput
  }

  export type CleaningZoneUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logs?: CleaningLogZoneUncheckedUpdateManyWithoutCleaningZoneNestedInput
  }

  export type CleaningZoneCreateManyInput = {
    id?: number
    name: string
    clientProfileId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CleaningZoneUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CleaningZoneUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CleaningLogCreateInput = {
    personName: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    clientProfile: ClientProfileCreateNestedOneWithoutCleaningLogsInput
    zones?: CleaningLogZoneCreateNestedManyWithoutCleaningLogInput
  }

  export type CleaningLogUncheckedCreateInput = {
    id?: number
    personName: string
    date?: Date | string
    clientProfileId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    zones?: CleaningLogZoneUncheckedCreateNestedManyWithoutCleaningLogInput
  }

  export type CleaningLogUpdateInput = {
    personName?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfile?: ClientProfileUpdateOneRequiredWithoutCleaningLogsNestedInput
    zones?: CleaningLogZoneUpdateManyWithoutCleaningLogNestedInput
  }

  export type CleaningLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    personName?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    zones?: CleaningLogZoneUncheckedUpdateManyWithoutCleaningLogNestedInput
  }

  export type CleaningLogCreateManyInput = {
    id?: number
    personName: string
    date?: Date | string
    clientProfileId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CleaningLogUpdateManyMutationInput = {
    personName?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CleaningLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    personName?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CleaningLogZoneCreateInput = {
    cleaningLog: CleaningLogCreateNestedOneWithoutZonesInput
    cleaningZone: CleaningZoneCreateNestedOneWithoutLogsInput
  }

  export type CleaningLogZoneUncheckedCreateInput = {
    cleaningLogId: number
    cleaningZoneId: number
  }

  export type CleaningLogZoneUpdateInput = {
    cleaningLog?: CleaningLogUpdateOneRequiredWithoutZonesNestedInput
    cleaningZone?: CleaningZoneUpdateOneRequiredWithoutLogsNestedInput
  }

  export type CleaningLogZoneUncheckedUpdateInput = {
    cleaningLogId?: IntFieldUpdateOperationsInput | number
    cleaningZoneId?: IntFieldUpdateOperationsInput | number
  }

  export type CleaningLogZoneCreateManyInput = {
    cleaningLogId: number
    cleaningZoneId: number
  }

  export type CleaningLogZoneUpdateManyMutationInput = {

  }

  export type CleaningLogZoneUncheckedUpdateManyInput = {
    cleaningLogId?: IntFieldUpdateOperationsInput | number
    cleaningZoneId?: IntFieldUpdateOperationsInput | number
  }

  export type ChamberCreateInput = {
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    clientProfile: ClientProfileCreateNestedOneWithoutChambersInput
    values?: TemperatureValueCreateNestedManyWithoutChamberInput
  }

  export type ChamberUncheckedCreateInput = {
    id?: number
    name: string
    clientProfileId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    values?: TemperatureValueUncheckedCreateNestedManyWithoutChamberInput
  }

  export type ChamberUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfile?: ClientProfileUpdateOneRequiredWithoutChambersNestedInput
    values?: TemperatureValueUpdateManyWithoutChamberNestedInput
  }

  export type ChamberUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    values?: TemperatureValueUncheckedUpdateManyWithoutChamberNestedInput
  }

  export type ChamberCreateManyInput = {
    id?: number
    name: string
    clientProfileId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChamberUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChamberUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemperatureRecordCreateInput = {
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    clientProfile: ClientProfileCreateNestedOneWithoutTemperatureRecordsInput
    values?: TemperatureValueCreateNestedManyWithoutRecordInput
  }

  export type TemperatureRecordUncheckedCreateInput = {
    id?: number
    date?: Date | string
    clientProfileId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    values?: TemperatureValueUncheckedCreateNestedManyWithoutRecordInput
  }

  export type TemperatureRecordUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfile?: ClientProfileUpdateOneRequiredWithoutTemperatureRecordsNestedInput
    values?: TemperatureValueUpdateManyWithoutRecordNestedInput
  }

  export type TemperatureRecordUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    values?: TemperatureValueUncheckedUpdateManyWithoutRecordNestedInput
  }

  export type TemperatureRecordCreateManyInput = {
    id?: number
    date?: Date | string
    clientProfileId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemperatureRecordUpdateManyMutationInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemperatureRecordUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemperatureValueCreateInput = {
    value: number
    chamber: ChamberCreateNestedOneWithoutValuesInput
    record: TemperatureRecordCreateNestedOneWithoutValuesInput
  }

  export type TemperatureValueUncheckedCreateInput = {
    id?: number
    value: number
    chamberId: number
    temperatureRecordId: number
  }

  export type TemperatureValueUpdateInput = {
    value?: FloatFieldUpdateOperationsInput | number
    chamber?: ChamberUpdateOneRequiredWithoutValuesNestedInput
    record?: TemperatureRecordUpdateOneRequiredWithoutValuesNestedInput
  }

  export type TemperatureValueUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    value?: FloatFieldUpdateOperationsInput | number
    chamberId?: IntFieldUpdateOperationsInput | number
    temperatureRecordId?: IntFieldUpdateOperationsInput | number
  }

  export type TemperatureValueCreateManyInput = {
    id?: number
    value: number
    chamberId: number
    temperatureRecordId: number
  }

  export type TemperatureValueUpdateManyMutationInput = {
    value?: FloatFieldUpdateOperationsInput | number
  }

  export type TemperatureValueUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    value?: FloatFieldUpdateOperationsInput | number
    chamberId?: IntFieldUpdateOperationsInput | number
    temperatureRecordId?: IntFieldUpdateOperationsInput | number
  }

  export type GoodsReceiptCreateInput = {
    providerName?: string | null
    productName: string
    lote?: string | null
    invoiceNumber?: string | null
    quantity?: string | null
    date?: Date | string
    deliveryNoteImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    clientProfile: ClientProfileCreateNestedOneWithoutGoodsReceiptsInput
  }

  export type GoodsReceiptUncheckedCreateInput = {
    id?: number
    providerName?: string | null
    productName: string
    lote?: string | null
    invoiceNumber?: string | null
    quantity?: string | null
    date?: Date | string
    deliveryNoteImage?: string | null
    clientProfileId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoodsReceiptUpdateInput = {
    providerName?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: StringFieldUpdateOperationsInput | string
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveryNoteImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfile?: ClientProfileUpdateOneRequiredWithoutGoodsReceiptsNestedInput
  }

  export type GoodsReceiptUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    providerName?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: StringFieldUpdateOperationsInput | string
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveryNoteImage?: NullableStringFieldUpdateOperationsInput | string | null
    clientProfileId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoodsReceiptCreateManyInput = {
    id?: number
    providerName?: string | null
    productName: string
    lote?: string | null
    invoiceNumber?: string | null
    quantity?: string | null
    date?: Date | string
    deliveryNoteImage?: string | null
    clientProfileId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoodsReceiptUpdateManyMutationInput = {
    providerName?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: StringFieldUpdateOperationsInput | string
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveryNoteImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoodsReceiptUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    providerName?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: StringFieldUpdateOperationsInput | string
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveryNoteImage?: NullableStringFieldUpdateOperationsInput | string | null
    clientProfileId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ClientProfileNullableRelationFilter = {
    is?: ClientProfileWhereInput | null
    isNot?: ClientProfileWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    emailVerified?: SortOrder
    verificationToken?: SortOrder
    verificationTokenExpires?: SortOrder
    resetPasswordToken?: SortOrder
    resetPasswordExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    emailVerified?: SortOrder
    verificationToken?: SortOrder
    verificationTokenExpires?: SortOrder
    resetPasswordToken?: SortOrder
    resetPasswordExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    emailVerified?: SortOrder
    verificationToken?: SortOrder
    verificationTokenExpires?: SortOrder
    resetPasswordToken?: SortOrder
    resetPasswordExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type RecipeListRelationFilter = {
    every?: RecipeWhereInput
    some?: RecipeWhereInput
    none?: RecipeWhereInput
  }

  export type CleaningZoneListRelationFilter = {
    every?: CleaningZoneWhereInput
    some?: CleaningZoneWhereInput
    none?: CleaningZoneWhereInput
  }

  export type CleaningLogListRelationFilter = {
    every?: CleaningLogWhereInput
    some?: CleaningLogWhereInput
    none?: CleaningLogWhereInput
  }

  export type ChamberListRelationFilter = {
    every?: ChamberWhereInput
    some?: ChamberWhereInput
    none?: ChamberWhereInput
  }

  export type TemperatureRecordListRelationFilter = {
    every?: TemperatureRecordWhereInput
    some?: TemperatureRecordWhereInput
    none?: TemperatureRecordWhereInput
  }

  export type GoodsReceiptListRelationFilter = {
    every?: GoodsReceiptWhereInput
    some?: GoodsReceiptWhereInput
    none?: GoodsReceiptWhereInput
  }

  export type RecipeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CleaningZoneOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CleaningLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChamberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TemperatureRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GoodsReceiptOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClientProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    razonSocial?: SortOrder
    nif?: SortOrder
    phone?: SortOrder
    urlClientify?: SortOrder
    accountType?: SortOrder
    recetasContratadas?: SortOrder
    canManageRecipes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientProfileAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    recetasContratadas?: SortOrder
  }

  export type ClientProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    razonSocial?: SortOrder
    nif?: SortOrder
    phone?: SortOrder
    urlClientify?: SortOrder
    accountType?: SortOrder
    recetasContratadas?: SortOrder
    canManageRecipes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    razonSocial?: SortOrder
    nif?: SortOrder
    phone?: SortOrder
    urlClientify?: SortOrder
    accountType?: SortOrder
    recetasContratadas?: SortOrder
    canManageRecipes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientProfileSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    recetasContratadas?: SortOrder
  }

  export type ClientProfileRelationFilter = {
    is?: ClientProfileWhereInput
    isNot?: ClientProfileWhereInput
  }

  export type IngredientListRelationFilter = {
    every?: IngredientWhereInput
    some?: IngredientWhereInput
    none?: IngredientWhereInput
  }

  export type ElaborationListRelationFilter = {
    every?: ElaborationWhereInput
    some?: ElaborationWhereInput
    none?: ElaborationWhereInput
  }

  export type IngredientOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ElaborationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RecipeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    clientProfileId?: SortOrder
    lotesMandatory?: SortOrder
    quantitiesMandatory?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RecipeAvgOrderByAggregateInput = {
    id?: SortOrder
    clientProfileId?: SortOrder
  }

  export type RecipeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    clientProfileId?: SortOrder
    lotesMandatory?: SortOrder
    quantitiesMandatory?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RecipeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    clientProfileId?: SortOrder
    lotesMandatory?: SortOrder
    quantitiesMandatory?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RecipeSumOrderByAggregateInput = {
    id?: SortOrder
    clientProfileId?: SortOrder
  }

  export type RecipeRelationFilter = {
    is?: RecipeWhereInput
    isNot?: RecipeWhereInput
  }

  export type IngredientCountOrderByAggregateInput = {
    id?: SortOrder
    recipeId?: SortOrder
    name?: SortOrder
    amount?: SortOrder
    unit?: SortOrder
    loteMandatory?: SortOrder
    quantityMandatory?: SortOrder
    createdAt?: SortOrder
  }

  export type IngredientAvgOrderByAggregateInput = {
    id?: SortOrder
    recipeId?: SortOrder
  }

  export type IngredientMaxOrderByAggregateInput = {
    id?: SortOrder
    recipeId?: SortOrder
    name?: SortOrder
    amount?: SortOrder
    unit?: SortOrder
    loteMandatory?: SortOrder
    quantityMandatory?: SortOrder
    createdAt?: SortOrder
  }

  export type IngredientMinOrderByAggregateInput = {
    id?: SortOrder
    recipeId?: SortOrder
    name?: SortOrder
    amount?: SortOrder
    unit?: SortOrder
    loteMandatory?: SortOrder
    quantityMandatory?: SortOrder
    createdAt?: SortOrder
  }

  export type IngredientSumOrderByAggregateInput = {
    id?: SortOrder
    recipeId?: SortOrder
  }

  export type ElaborationIngredientListRelationFilter = {
    every?: ElaborationIngredientWhereInput
    some?: ElaborationIngredientWhereInput
    none?: ElaborationIngredientWhereInput
  }

  export type ElaborationIngredientOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ElaborationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    date?: SortOrder
    recipeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ElaborationAvgOrderByAggregateInput = {
    id?: SortOrder
    recipeId?: SortOrder
  }

  export type ElaborationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    date?: SortOrder
    recipeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ElaborationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    date?: SortOrder
    recipeId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ElaborationSumOrderByAggregateInput = {
    id?: SortOrder
    recipeId?: SortOrder
  }

  export type ElaborationRelationFilter = {
    is?: ElaborationWhereInput
    isNot?: ElaborationWhereInput
  }

  export type ElaborationIngredientCountOrderByAggregateInput = {
    id?: SortOrder
    elaborationId?: SortOrder
    name?: SortOrder
    lote?: SortOrder
    realAmount?: SortOrder
    unit?: SortOrder
    createdAt?: SortOrder
  }

  export type ElaborationIngredientAvgOrderByAggregateInput = {
    id?: SortOrder
    elaborationId?: SortOrder
  }

  export type ElaborationIngredientMaxOrderByAggregateInput = {
    id?: SortOrder
    elaborationId?: SortOrder
    name?: SortOrder
    lote?: SortOrder
    realAmount?: SortOrder
    unit?: SortOrder
    createdAt?: SortOrder
  }

  export type ElaborationIngredientMinOrderByAggregateInput = {
    id?: SortOrder
    elaborationId?: SortOrder
    name?: SortOrder
    lote?: SortOrder
    realAmount?: SortOrder
    unit?: SortOrder
    createdAt?: SortOrder
  }

  export type ElaborationIngredientSumOrderByAggregateInput = {
    id?: SortOrder
    elaborationId?: SortOrder
  }

  export type CleaningLogZoneListRelationFilter = {
    every?: CleaningLogZoneWhereInput
    some?: CleaningLogZoneWhereInput
    none?: CleaningLogZoneWhereInput
  }

  export type CleaningLogZoneOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CleaningZoneCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CleaningZoneAvgOrderByAggregateInput = {
    id?: SortOrder
    clientProfileId?: SortOrder
  }

  export type CleaningZoneMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CleaningZoneMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CleaningZoneSumOrderByAggregateInput = {
    id?: SortOrder
    clientProfileId?: SortOrder
  }

  export type CleaningLogCountOrderByAggregateInput = {
    id?: SortOrder
    personName?: SortOrder
    date?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CleaningLogAvgOrderByAggregateInput = {
    id?: SortOrder
    clientProfileId?: SortOrder
  }

  export type CleaningLogMaxOrderByAggregateInput = {
    id?: SortOrder
    personName?: SortOrder
    date?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CleaningLogMinOrderByAggregateInput = {
    id?: SortOrder
    personName?: SortOrder
    date?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CleaningLogSumOrderByAggregateInput = {
    id?: SortOrder
    clientProfileId?: SortOrder
  }

  export type CleaningLogRelationFilter = {
    is?: CleaningLogWhereInput
    isNot?: CleaningLogWhereInput
  }

  export type CleaningZoneRelationFilter = {
    is?: CleaningZoneWhereInput
    isNot?: CleaningZoneWhereInput
  }

  export type CleaningLogZoneCleaningLogIdCleaningZoneIdCompoundUniqueInput = {
    cleaningLogId: number
    cleaningZoneId: number
  }

  export type CleaningLogZoneCountOrderByAggregateInput = {
    cleaningLogId?: SortOrder
    cleaningZoneId?: SortOrder
  }

  export type CleaningLogZoneAvgOrderByAggregateInput = {
    cleaningLogId?: SortOrder
    cleaningZoneId?: SortOrder
  }

  export type CleaningLogZoneMaxOrderByAggregateInput = {
    cleaningLogId?: SortOrder
    cleaningZoneId?: SortOrder
  }

  export type CleaningLogZoneMinOrderByAggregateInput = {
    cleaningLogId?: SortOrder
    cleaningZoneId?: SortOrder
  }

  export type CleaningLogZoneSumOrderByAggregateInput = {
    cleaningLogId?: SortOrder
    cleaningZoneId?: SortOrder
  }

  export type TemperatureValueListRelationFilter = {
    every?: TemperatureValueWhereInput
    some?: TemperatureValueWhereInput
    none?: TemperatureValueWhereInput
  }

  export type TemperatureValueOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChamberCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChamberAvgOrderByAggregateInput = {
    id?: SortOrder
    clientProfileId?: SortOrder
  }

  export type ChamberMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChamberMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChamberSumOrderByAggregateInput = {
    id?: SortOrder
    clientProfileId?: SortOrder
  }

  export type TemperatureRecordCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TemperatureRecordAvgOrderByAggregateInput = {
    id?: SortOrder
    clientProfileId?: SortOrder
  }

  export type TemperatureRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TemperatureRecordMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TemperatureRecordSumOrderByAggregateInput = {
    id?: SortOrder
    clientProfileId?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type ChamberRelationFilter = {
    is?: ChamberWhereInput
    isNot?: ChamberWhereInput
  }

  export type TemperatureRecordRelationFilter = {
    is?: TemperatureRecordWhereInput
    isNot?: TemperatureRecordWhereInput
  }

  export type TemperatureValueCountOrderByAggregateInput = {
    id?: SortOrder
    value?: SortOrder
    chamberId?: SortOrder
    temperatureRecordId?: SortOrder
  }

  export type TemperatureValueAvgOrderByAggregateInput = {
    id?: SortOrder
    value?: SortOrder
    chamberId?: SortOrder
    temperatureRecordId?: SortOrder
  }

  export type TemperatureValueMaxOrderByAggregateInput = {
    id?: SortOrder
    value?: SortOrder
    chamberId?: SortOrder
    temperatureRecordId?: SortOrder
  }

  export type TemperatureValueMinOrderByAggregateInput = {
    id?: SortOrder
    value?: SortOrder
    chamberId?: SortOrder
    temperatureRecordId?: SortOrder
  }

  export type TemperatureValueSumOrderByAggregateInput = {
    id?: SortOrder
    value?: SortOrder
    chamberId?: SortOrder
    temperatureRecordId?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type GoodsReceiptCountOrderByAggregateInput = {
    id?: SortOrder
    providerName?: SortOrder
    productName?: SortOrder
    lote?: SortOrder
    invoiceNumber?: SortOrder
    quantity?: SortOrder
    date?: SortOrder
    deliveryNoteImage?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoodsReceiptAvgOrderByAggregateInput = {
    id?: SortOrder
    clientProfileId?: SortOrder
  }

  export type GoodsReceiptMaxOrderByAggregateInput = {
    id?: SortOrder
    providerName?: SortOrder
    productName?: SortOrder
    lote?: SortOrder
    invoiceNumber?: SortOrder
    quantity?: SortOrder
    date?: SortOrder
    deliveryNoteImage?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoodsReceiptMinOrderByAggregateInput = {
    id?: SortOrder
    providerName?: SortOrder
    productName?: SortOrder
    lote?: SortOrder
    invoiceNumber?: SortOrder
    quantity?: SortOrder
    date?: SortOrder
    deliveryNoteImage?: SortOrder
    clientProfileId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoodsReceiptSumOrderByAggregateInput = {
    id?: SortOrder
    clientProfileId?: SortOrder
  }

  export type ClientProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<ClientProfileCreateWithoutUserInput, ClientProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutUserInput
    connect?: ClientProfileWhereUniqueInput
  }

  export type ClientProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<ClientProfileCreateWithoutUserInput, ClientProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutUserInput
    connect?: ClientProfileWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ClientProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<ClientProfileCreateWithoutUserInput, ClientProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutUserInput
    upsert?: ClientProfileUpsertWithoutUserInput
    disconnect?: ClientProfileWhereInput | boolean
    delete?: ClientProfileWhereInput | boolean
    connect?: ClientProfileWhereUniqueInput
    update?: XOR<XOR<ClientProfileUpdateToOneWithWhereWithoutUserInput, ClientProfileUpdateWithoutUserInput>, ClientProfileUncheckedUpdateWithoutUserInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ClientProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<ClientProfileCreateWithoutUserInput, ClientProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutUserInput
    upsert?: ClientProfileUpsertWithoutUserInput
    disconnect?: ClientProfileWhereInput | boolean
    delete?: ClientProfileWhereInput | boolean
    connect?: ClientProfileWhereUniqueInput
    update?: XOR<XOR<ClientProfileUpdateToOneWithWhereWithoutUserInput, ClientProfileUpdateWithoutUserInput>, ClientProfileUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutClientProfileInput = {
    create?: XOR<UserCreateWithoutClientProfileInput, UserUncheckedCreateWithoutClientProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutClientProfileInput
    connect?: UserWhereUniqueInput
  }

  export type RecipeCreateNestedManyWithoutClientProfileInput = {
    create?: XOR<RecipeCreateWithoutClientProfileInput, RecipeUncheckedCreateWithoutClientProfileInput> | RecipeCreateWithoutClientProfileInput[] | RecipeUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: RecipeCreateOrConnectWithoutClientProfileInput | RecipeCreateOrConnectWithoutClientProfileInput[]
    createMany?: RecipeCreateManyClientProfileInputEnvelope
    connect?: RecipeWhereUniqueInput | RecipeWhereUniqueInput[]
  }

  export type CleaningZoneCreateNestedManyWithoutClientProfileInput = {
    create?: XOR<CleaningZoneCreateWithoutClientProfileInput, CleaningZoneUncheckedCreateWithoutClientProfileInput> | CleaningZoneCreateWithoutClientProfileInput[] | CleaningZoneUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: CleaningZoneCreateOrConnectWithoutClientProfileInput | CleaningZoneCreateOrConnectWithoutClientProfileInput[]
    createMany?: CleaningZoneCreateManyClientProfileInputEnvelope
    connect?: CleaningZoneWhereUniqueInput | CleaningZoneWhereUniqueInput[]
  }

  export type CleaningLogCreateNestedManyWithoutClientProfileInput = {
    create?: XOR<CleaningLogCreateWithoutClientProfileInput, CleaningLogUncheckedCreateWithoutClientProfileInput> | CleaningLogCreateWithoutClientProfileInput[] | CleaningLogUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: CleaningLogCreateOrConnectWithoutClientProfileInput | CleaningLogCreateOrConnectWithoutClientProfileInput[]
    createMany?: CleaningLogCreateManyClientProfileInputEnvelope
    connect?: CleaningLogWhereUniqueInput | CleaningLogWhereUniqueInput[]
  }

  export type ChamberCreateNestedManyWithoutClientProfileInput = {
    create?: XOR<ChamberCreateWithoutClientProfileInput, ChamberUncheckedCreateWithoutClientProfileInput> | ChamberCreateWithoutClientProfileInput[] | ChamberUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: ChamberCreateOrConnectWithoutClientProfileInput | ChamberCreateOrConnectWithoutClientProfileInput[]
    createMany?: ChamberCreateManyClientProfileInputEnvelope
    connect?: ChamberWhereUniqueInput | ChamberWhereUniqueInput[]
  }

  export type TemperatureRecordCreateNestedManyWithoutClientProfileInput = {
    create?: XOR<TemperatureRecordCreateWithoutClientProfileInput, TemperatureRecordUncheckedCreateWithoutClientProfileInput> | TemperatureRecordCreateWithoutClientProfileInput[] | TemperatureRecordUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: TemperatureRecordCreateOrConnectWithoutClientProfileInput | TemperatureRecordCreateOrConnectWithoutClientProfileInput[]
    createMany?: TemperatureRecordCreateManyClientProfileInputEnvelope
    connect?: TemperatureRecordWhereUniqueInput | TemperatureRecordWhereUniqueInput[]
  }

  export type GoodsReceiptCreateNestedManyWithoutClientProfileInput = {
    create?: XOR<GoodsReceiptCreateWithoutClientProfileInput, GoodsReceiptUncheckedCreateWithoutClientProfileInput> | GoodsReceiptCreateWithoutClientProfileInput[] | GoodsReceiptUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: GoodsReceiptCreateOrConnectWithoutClientProfileInput | GoodsReceiptCreateOrConnectWithoutClientProfileInput[]
    createMany?: GoodsReceiptCreateManyClientProfileInputEnvelope
    connect?: GoodsReceiptWhereUniqueInput | GoodsReceiptWhereUniqueInput[]
  }

  export type RecipeUncheckedCreateNestedManyWithoutClientProfileInput = {
    create?: XOR<RecipeCreateWithoutClientProfileInput, RecipeUncheckedCreateWithoutClientProfileInput> | RecipeCreateWithoutClientProfileInput[] | RecipeUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: RecipeCreateOrConnectWithoutClientProfileInput | RecipeCreateOrConnectWithoutClientProfileInput[]
    createMany?: RecipeCreateManyClientProfileInputEnvelope
    connect?: RecipeWhereUniqueInput | RecipeWhereUniqueInput[]
  }

  export type CleaningZoneUncheckedCreateNestedManyWithoutClientProfileInput = {
    create?: XOR<CleaningZoneCreateWithoutClientProfileInput, CleaningZoneUncheckedCreateWithoutClientProfileInput> | CleaningZoneCreateWithoutClientProfileInput[] | CleaningZoneUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: CleaningZoneCreateOrConnectWithoutClientProfileInput | CleaningZoneCreateOrConnectWithoutClientProfileInput[]
    createMany?: CleaningZoneCreateManyClientProfileInputEnvelope
    connect?: CleaningZoneWhereUniqueInput | CleaningZoneWhereUniqueInput[]
  }

  export type CleaningLogUncheckedCreateNestedManyWithoutClientProfileInput = {
    create?: XOR<CleaningLogCreateWithoutClientProfileInput, CleaningLogUncheckedCreateWithoutClientProfileInput> | CleaningLogCreateWithoutClientProfileInput[] | CleaningLogUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: CleaningLogCreateOrConnectWithoutClientProfileInput | CleaningLogCreateOrConnectWithoutClientProfileInput[]
    createMany?: CleaningLogCreateManyClientProfileInputEnvelope
    connect?: CleaningLogWhereUniqueInput | CleaningLogWhereUniqueInput[]
  }

  export type ChamberUncheckedCreateNestedManyWithoutClientProfileInput = {
    create?: XOR<ChamberCreateWithoutClientProfileInput, ChamberUncheckedCreateWithoutClientProfileInput> | ChamberCreateWithoutClientProfileInput[] | ChamberUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: ChamberCreateOrConnectWithoutClientProfileInput | ChamberCreateOrConnectWithoutClientProfileInput[]
    createMany?: ChamberCreateManyClientProfileInputEnvelope
    connect?: ChamberWhereUniqueInput | ChamberWhereUniqueInput[]
  }

  export type TemperatureRecordUncheckedCreateNestedManyWithoutClientProfileInput = {
    create?: XOR<TemperatureRecordCreateWithoutClientProfileInput, TemperatureRecordUncheckedCreateWithoutClientProfileInput> | TemperatureRecordCreateWithoutClientProfileInput[] | TemperatureRecordUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: TemperatureRecordCreateOrConnectWithoutClientProfileInput | TemperatureRecordCreateOrConnectWithoutClientProfileInput[]
    createMany?: TemperatureRecordCreateManyClientProfileInputEnvelope
    connect?: TemperatureRecordWhereUniqueInput | TemperatureRecordWhereUniqueInput[]
  }

  export type GoodsReceiptUncheckedCreateNestedManyWithoutClientProfileInput = {
    create?: XOR<GoodsReceiptCreateWithoutClientProfileInput, GoodsReceiptUncheckedCreateWithoutClientProfileInput> | GoodsReceiptCreateWithoutClientProfileInput[] | GoodsReceiptUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: GoodsReceiptCreateOrConnectWithoutClientProfileInput | GoodsReceiptCreateOrConnectWithoutClientProfileInput[]
    createMany?: GoodsReceiptCreateManyClientProfileInputEnvelope
    connect?: GoodsReceiptWhereUniqueInput | GoodsReceiptWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutClientProfileNestedInput = {
    create?: XOR<UserCreateWithoutClientProfileInput, UserUncheckedCreateWithoutClientProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutClientProfileInput
    upsert?: UserUpsertWithoutClientProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutClientProfileInput, UserUpdateWithoutClientProfileInput>, UserUncheckedUpdateWithoutClientProfileInput>
  }

  export type RecipeUpdateManyWithoutClientProfileNestedInput = {
    create?: XOR<RecipeCreateWithoutClientProfileInput, RecipeUncheckedCreateWithoutClientProfileInput> | RecipeCreateWithoutClientProfileInput[] | RecipeUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: RecipeCreateOrConnectWithoutClientProfileInput | RecipeCreateOrConnectWithoutClientProfileInput[]
    upsert?: RecipeUpsertWithWhereUniqueWithoutClientProfileInput | RecipeUpsertWithWhereUniqueWithoutClientProfileInput[]
    createMany?: RecipeCreateManyClientProfileInputEnvelope
    set?: RecipeWhereUniqueInput | RecipeWhereUniqueInput[]
    disconnect?: RecipeWhereUniqueInput | RecipeWhereUniqueInput[]
    delete?: RecipeWhereUniqueInput | RecipeWhereUniqueInput[]
    connect?: RecipeWhereUniqueInput | RecipeWhereUniqueInput[]
    update?: RecipeUpdateWithWhereUniqueWithoutClientProfileInput | RecipeUpdateWithWhereUniqueWithoutClientProfileInput[]
    updateMany?: RecipeUpdateManyWithWhereWithoutClientProfileInput | RecipeUpdateManyWithWhereWithoutClientProfileInput[]
    deleteMany?: RecipeScalarWhereInput | RecipeScalarWhereInput[]
  }

  export type CleaningZoneUpdateManyWithoutClientProfileNestedInput = {
    create?: XOR<CleaningZoneCreateWithoutClientProfileInput, CleaningZoneUncheckedCreateWithoutClientProfileInput> | CleaningZoneCreateWithoutClientProfileInput[] | CleaningZoneUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: CleaningZoneCreateOrConnectWithoutClientProfileInput | CleaningZoneCreateOrConnectWithoutClientProfileInput[]
    upsert?: CleaningZoneUpsertWithWhereUniqueWithoutClientProfileInput | CleaningZoneUpsertWithWhereUniqueWithoutClientProfileInput[]
    createMany?: CleaningZoneCreateManyClientProfileInputEnvelope
    set?: CleaningZoneWhereUniqueInput | CleaningZoneWhereUniqueInput[]
    disconnect?: CleaningZoneWhereUniqueInput | CleaningZoneWhereUniqueInput[]
    delete?: CleaningZoneWhereUniqueInput | CleaningZoneWhereUniqueInput[]
    connect?: CleaningZoneWhereUniqueInput | CleaningZoneWhereUniqueInput[]
    update?: CleaningZoneUpdateWithWhereUniqueWithoutClientProfileInput | CleaningZoneUpdateWithWhereUniqueWithoutClientProfileInput[]
    updateMany?: CleaningZoneUpdateManyWithWhereWithoutClientProfileInput | CleaningZoneUpdateManyWithWhereWithoutClientProfileInput[]
    deleteMany?: CleaningZoneScalarWhereInput | CleaningZoneScalarWhereInput[]
  }

  export type CleaningLogUpdateManyWithoutClientProfileNestedInput = {
    create?: XOR<CleaningLogCreateWithoutClientProfileInput, CleaningLogUncheckedCreateWithoutClientProfileInput> | CleaningLogCreateWithoutClientProfileInput[] | CleaningLogUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: CleaningLogCreateOrConnectWithoutClientProfileInput | CleaningLogCreateOrConnectWithoutClientProfileInput[]
    upsert?: CleaningLogUpsertWithWhereUniqueWithoutClientProfileInput | CleaningLogUpsertWithWhereUniqueWithoutClientProfileInput[]
    createMany?: CleaningLogCreateManyClientProfileInputEnvelope
    set?: CleaningLogWhereUniqueInput | CleaningLogWhereUniqueInput[]
    disconnect?: CleaningLogWhereUniqueInput | CleaningLogWhereUniqueInput[]
    delete?: CleaningLogWhereUniqueInput | CleaningLogWhereUniqueInput[]
    connect?: CleaningLogWhereUniqueInput | CleaningLogWhereUniqueInput[]
    update?: CleaningLogUpdateWithWhereUniqueWithoutClientProfileInput | CleaningLogUpdateWithWhereUniqueWithoutClientProfileInput[]
    updateMany?: CleaningLogUpdateManyWithWhereWithoutClientProfileInput | CleaningLogUpdateManyWithWhereWithoutClientProfileInput[]
    deleteMany?: CleaningLogScalarWhereInput | CleaningLogScalarWhereInput[]
  }

  export type ChamberUpdateManyWithoutClientProfileNestedInput = {
    create?: XOR<ChamberCreateWithoutClientProfileInput, ChamberUncheckedCreateWithoutClientProfileInput> | ChamberCreateWithoutClientProfileInput[] | ChamberUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: ChamberCreateOrConnectWithoutClientProfileInput | ChamberCreateOrConnectWithoutClientProfileInput[]
    upsert?: ChamberUpsertWithWhereUniqueWithoutClientProfileInput | ChamberUpsertWithWhereUniqueWithoutClientProfileInput[]
    createMany?: ChamberCreateManyClientProfileInputEnvelope
    set?: ChamberWhereUniqueInput | ChamberWhereUniqueInput[]
    disconnect?: ChamberWhereUniqueInput | ChamberWhereUniqueInput[]
    delete?: ChamberWhereUniqueInput | ChamberWhereUniqueInput[]
    connect?: ChamberWhereUniqueInput | ChamberWhereUniqueInput[]
    update?: ChamberUpdateWithWhereUniqueWithoutClientProfileInput | ChamberUpdateWithWhereUniqueWithoutClientProfileInput[]
    updateMany?: ChamberUpdateManyWithWhereWithoutClientProfileInput | ChamberUpdateManyWithWhereWithoutClientProfileInput[]
    deleteMany?: ChamberScalarWhereInput | ChamberScalarWhereInput[]
  }

  export type TemperatureRecordUpdateManyWithoutClientProfileNestedInput = {
    create?: XOR<TemperatureRecordCreateWithoutClientProfileInput, TemperatureRecordUncheckedCreateWithoutClientProfileInput> | TemperatureRecordCreateWithoutClientProfileInput[] | TemperatureRecordUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: TemperatureRecordCreateOrConnectWithoutClientProfileInput | TemperatureRecordCreateOrConnectWithoutClientProfileInput[]
    upsert?: TemperatureRecordUpsertWithWhereUniqueWithoutClientProfileInput | TemperatureRecordUpsertWithWhereUniqueWithoutClientProfileInput[]
    createMany?: TemperatureRecordCreateManyClientProfileInputEnvelope
    set?: TemperatureRecordWhereUniqueInput | TemperatureRecordWhereUniqueInput[]
    disconnect?: TemperatureRecordWhereUniqueInput | TemperatureRecordWhereUniqueInput[]
    delete?: TemperatureRecordWhereUniqueInput | TemperatureRecordWhereUniqueInput[]
    connect?: TemperatureRecordWhereUniqueInput | TemperatureRecordWhereUniqueInput[]
    update?: TemperatureRecordUpdateWithWhereUniqueWithoutClientProfileInput | TemperatureRecordUpdateWithWhereUniqueWithoutClientProfileInput[]
    updateMany?: TemperatureRecordUpdateManyWithWhereWithoutClientProfileInput | TemperatureRecordUpdateManyWithWhereWithoutClientProfileInput[]
    deleteMany?: TemperatureRecordScalarWhereInput | TemperatureRecordScalarWhereInput[]
  }

  export type GoodsReceiptUpdateManyWithoutClientProfileNestedInput = {
    create?: XOR<GoodsReceiptCreateWithoutClientProfileInput, GoodsReceiptUncheckedCreateWithoutClientProfileInput> | GoodsReceiptCreateWithoutClientProfileInput[] | GoodsReceiptUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: GoodsReceiptCreateOrConnectWithoutClientProfileInput | GoodsReceiptCreateOrConnectWithoutClientProfileInput[]
    upsert?: GoodsReceiptUpsertWithWhereUniqueWithoutClientProfileInput | GoodsReceiptUpsertWithWhereUniqueWithoutClientProfileInput[]
    createMany?: GoodsReceiptCreateManyClientProfileInputEnvelope
    set?: GoodsReceiptWhereUniqueInput | GoodsReceiptWhereUniqueInput[]
    disconnect?: GoodsReceiptWhereUniqueInput | GoodsReceiptWhereUniqueInput[]
    delete?: GoodsReceiptWhereUniqueInput | GoodsReceiptWhereUniqueInput[]
    connect?: GoodsReceiptWhereUniqueInput | GoodsReceiptWhereUniqueInput[]
    update?: GoodsReceiptUpdateWithWhereUniqueWithoutClientProfileInput | GoodsReceiptUpdateWithWhereUniqueWithoutClientProfileInput[]
    updateMany?: GoodsReceiptUpdateManyWithWhereWithoutClientProfileInput | GoodsReceiptUpdateManyWithWhereWithoutClientProfileInput[]
    deleteMany?: GoodsReceiptScalarWhereInput | GoodsReceiptScalarWhereInput[]
  }

  export type RecipeUncheckedUpdateManyWithoutClientProfileNestedInput = {
    create?: XOR<RecipeCreateWithoutClientProfileInput, RecipeUncheckedCreateWithoutClientProfileInput> | RecipeCreateWithoutClientProfileInput[] | RecipeUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: RecipeCreateOrConnectWithoutClientProfileInput | RecipeCreateOrConnectWithoutClientProfileInput[]
    upsert?: RecipeUpsertWithWhereUniqueWithoutClientProfileInput | RecipeUpsertWithWhereUniqueWithoutClientProfileInput[]
    createMany?: RecipeCreateManyClientProfileInputEnvelope
    set?: RecipeWhereUniqueInput | RecipeWhereUniqueInput[]
    disconnect?: RecipeWhereUniqueInput | RecipeWhereUniqueInput[]
    delete?: RecipeWhereUniqueInput | RecipeWhereUniqueInput[]
    connect?: RecipeWhereUniqueInput | RecipeWhereUniqueInput[]
    update?: RecipeUpdateWithWhereUniqueWithoutClientProfileInput | RecipeUpdateWithWhereUniqueWithoutClientProfileInput[]
    updateMany?: RecipeUpdateManyWithWhereWithoutClientProfileInput | RecipeUpdateManyWithWhereWithoutClientProfileInput[]
    deleteMany?: RecipeScalarWhereInput | RecipeScalarWhereInput[]
  }

  export type CleaningZoneUncheckedUpdateManyWithoutClientProfileNestedInput = {
    create?: XOR<CleaningZoneCreateWithoutClientProfileInput, CleaningZoneUncheckedCreateWithoutClientProfileInput> | CleaningZoneCreateWithoutClientProfileInput[] | CleaningZoneUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: CleaningZoneCreateOrConnectWithoutClientProfileInput | CleaningZoneCreateOrConnectWithoutClientProfileInput[]
    upsert?: CleaningZoneUpsertWithWhereUniqueWithoutClientProfileInput | CleaningZoneUpsertWithWhereUniqueWithoutClientProfileInput[]
    createMany?: CleaningZoneCreateManyClientProfileInputEnvelope
    set?: CleaningZoneWhereUniqueInput | CleaningZoneWhereUniqueInput[]
    disconnect?: CleaningZoneWhereUniqueInput | CleaningZoneWhereUniqueInput[]
    delete?: CleaningZoneWhereUniqueInput | CleaningZoneWhereUniqueInput[]
    connect?: CleaningZoneWhereUniqueInput | CleaningZoneWhereUniqueInput[]
    update?: CleaningZoneUpdateWithWhereUniqueWithoutClientProfileInput | CleaningZoneUpdateWithWhereUniqueWithoutClientProfileInput[]
    updateMany?: CleaningZoneUpdateManyWithWhereWithoutClientProfileInput | CleaningZoneUpdateManyWithWhereWithoutClientProfileInput[]
    deleteMany?: CleaningZoneScalarWhereInput | CleaningZoneScalarWhereInput[]
  }

  export type CleaningLogUncheckedUpdateManyWithoutClientProfileNestedInput = {
    create?: XOR<CleaningLogCreateWithoutClientProfileInput, CleaningLogUncheckedCreateWithoutClientProfileInput> | CleaningLogCreateWithoutClientProfileInput[] | CleaningLogUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: CleaningLogCreateOrConnectWithoutClientProfileInput | CleaningLogCreateOrConnectWithoutClientProfileInput[]
    upsert?: CleaningLogUpsertWithWhereUniqueWithoutClientProfileInput | CleaningLogUpsertWithWhereUniqueWithoutClientProfileInput[]
    createMany?: CleaningLogCreateManyClientProfileInputEnvelope
    set?: CleaningLogWhereUniqueInput | CleaningLogWhereUniqueInput[]
    disconnect?: CleaningLogWhereUniqueInput | CleaningLogWhereUniqueInput[]
    delete?: CleaningLogWhereUniqueInput | CleaningLogWhereUniqueInput[]
    connect?: CleaningLogWhereUniqueInput | CleaningLogWhereUniqueInput[]
    update?: CleaningLogUpdateWithWhereUniqueWithoutClientProfileInput | CleaningLogUpdateWithWhereUniqueWithoutClientProfileInput[]
    updateMany?: CleaningLogUpdateManyWithWhereWithoutClientProfileInput | CleaningLogUpdateManyWithWhereWithoutClientProfileInput[]
    deleteMany?: CleaningLogScalarWhereInput | CleaningLogScalarWhereInput[]
  }

  export type ChamberUncheckedUpdateManyWithoutClientProfileNestedInput = {
    create?: XOR<ChamberCreateWithoutClientProfileInput, ChamberUncheckedCreateWithoutClientProfileInput> | ChamberCreateWithoutClientProfileInput[] | ChamberUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: ChamberCreateOrConnectWithoutClientProfileInput | ChamberCreateOrConnectWithoutClientProfileInput[]
    upsert?: ChamberUpsertWithWhereUniqueWithoutClientProfileInput | ChamberUpsertWithWhereUniqueWithoutClientProfileInput[]
    createMany?: ChamberCreateManyClientProfileInputEnvelope
    set?: ChamberWhereUniqueInput | ChamberWhereUniqueInput[]
    disconnect?: ChamberWhereUniqueInput | ChamberWhereUniqueInput[]
    delete?: ChamberWhereUniqueInput | ChamberWhereUniqueInput[]
    connect?: ChamberWhereUniqueInput | ChamberWhereUniqueInput[]
    update?: ChamberUpdateWithWhereUniqueWithoutClientProfileInput | ChamberUpdateWithWhereUniqueWithoutClientProfileInput[]
    updateMany?: ChamberUpdateManyWithWhereWithoutClientProfileInput | ChamberUpdateManyWithWhereWithoutClientProfileInput[]
    deleteMany?: ChamberScalarWhereInput | ChamberScalarWhereInput[]
  }

  export type TemperatureRecordUncheckedUpdateManyWithoutClientProfileNestedInput = {
    create?: XOR<TemperatureRecordCreateWithoutClientProfileInput, TemperatureRecordUncheckedCreateWithoutClientProfileInput> | TemperatureRecordCreateWithoutClientProfileInput[] | TemperatureRecordUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: TemperatureRecordCreateOrConnectWithoutClientProfileInput | TemperatureRecordCreateOrConnectWithoutClientProfileInput[]
    upsert?: TemperatureRecordUpsertWithWhereUniqueWithoutClientProfileInput | TemperatureRecordUpsertWithWhereUniqueWithoutClientProfileInput[]
    createMany?: TemperatureRecordCreateManyClientProfileInputEnvelope
    set?: TemperatureRecordWhereUniqueInput | TemperatureRecordWhereUniqueInput[]
    disconnect?: TemperatureRecordWhereUniqueInput | TemperatureRecordWhereUniqueInput[]
    delete?: TemperatureRecordWhereUniqueInput | TemperatureRecordWhereUniqueInput[]
    connect?: TemperatureRecordWhereUniqueInput | TemperatureRecordWhereUniqueInput[]
    update?: TemperatureRecordUpdateWithWhereUniqueWithoutClientProfileInput | TemperatureRecordUpdateWithWhereUniqueWithoutClientProfileInput[]
    updateMany?: TemperatureRecordUpdateManyWithWhereWithoutClientProfileInput | TemperatureRecordUpdateManyWithWhereWithoutClientProfileInput[]
    deleteMany?: TemperatureRecordScalarWhereInput | TemperatureRecordScalarWhereInput[]
  }

  export type GoodsReceiptUncheckedUpdateManyWithoutClientProfileNestedInput = {
    create?: XOR<GoodsReceiptCreateWithoutClientProfileInput, GoodsReceiptUncheckedCreateWithoutClientProfileInput> | GoodsReceiptCreateWithoutClientProfileInput[] | GoodsReceiptUncheckedCreateWithoutClientProfileInput[]
    connectOrCreate?: GoodsReceiptCreateOrConnectWithoutClientProfileInput | GoodsReceiptCreateOrConnectWithoutClientProfileInput[]
    upsert?: GoodsReceiptUpsertWithWhereUniqueWithoutClientProfileInput | GoodsReceiptUpsertWithWhereUniqueWithoutClientProfileInput[]
    createMany?: GoodsReceiptCreateManyClientProfileInputEnvelope
    set?: GoodsReceiptWhereUniqueInput | GoodsReceiptWhereUniqueInput[]
    disconnect?: GoodsReceiptWhereUniqueInput | GoodsReceiptWhereUniqueInput[]
    delete?: GoodsReceiptWhereUniqueInput | GoodsReceiptWhereUniqueInput[]
    connect?: GoodsReceiptWhereUniqueInput | GoodsReceiptWhereUniqueInput[]
    update?: GoodsReceiptUpdateWithWhereUniqueWithoutClientProfileInput | GoodsReceiptUpdateWithWhereUniqueWithoutClientProfileInput[]
    updateMany?: GoodsReceiptUpdateManyWithWhereWithoutClientProfileInput | GoodsReceiptUpdateManyWithWhereWithoutClientProfileInput[]
    deleteMany?: GoodsReceiptScalarWhereInput | GoodsReceiptScalarWhereInput[]
  }

  export type ClientProfileCreateNestedOneWithoutRecipesInput = {
    create?: XOR<ClientProfileCreateWithoutRecipesInput, ClientProfileUncheckedCreateWithoutRecipesInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutRecipesInput
    connect?: ClientProfileWhereUniqueInput
  }

  export type IngredientCreateNestedManyWithoutRecipeInput = {
    create?: XOR<IngredientCreateWithoutRecipeInput, IngredientUncheckedCreateWithoutRecipeInput> | IngredientCreateWithoutRecipeInput[] | IngredientUncheckedCreateWithoutRecipeInput[]
    connectOrCreate?: IngredientCreateOrConnectWithoutRecipeInput | IngredientCreateOrConnectWithoutRecipeInput[]
    createMany?: IngredientCreateManyRecipeInputEnvelope
    connect?: IngredientWhereUniqueInput | IngredientWhereUniqueInput[]
  }

  export type ElaborationCreateNestedManyWithoutRecipeInput = {
    create?: XOR<ElaborationCreateWithoutRecipeInput, ElaborationUncheckedCreateWithoutRecipeInput> | ElaborationCreateWithoutRecipeInput[] | ElaborationUncheckedCreateWithoutRecipeInput[]
    connectOrCreate?: ElaborationCreateOrConnectWithoutRecipeInput | ElaborationCreateOrConnectWithoutRecipeInput[]
    createMany?: ElaborationCreateManyRecipeInputEnvelope
    connect?: ElaborationWhereUniqueInput | ElaborationWhereUniqueInput[]
  }

  export type IngredientUncheckedCreateNestedManyWithoutRecipeInput = {
    create?: XOR<IngredientCreateWithoutRecipeInput, IngredientUncheckedCreateWithoutRecipeInput> | IngredientCreateWithoutRecipeInput[] | IngredientUncheckedCreateWithoutRecipeInput[]
    connectOrCreate?: IngredientCreateOrConnectWithoutRecipeInput | IngredientCreateOrConnectWithoutRecipeInput[]
    createMany?: IngredientCreateManyRecipeInputEnvelope
    connect?: IngredientWhereUniqueInput | IngredientWhereUniqueInput[]
  }

  export type ElaborationUncheckedCreateNestedManyWithoutRecipeInput = {
    create?: XOR<ElaborationCreateWithoutRecipeInput, ElaborationUncheckedCreateWithoutRecipeInput> | ElaborationCreateWithoutRecipeInput[] | ElaborationUncheckedCreateWithoutRecipeInput[]
    connectOrCreate?: ElaborationCreateOrConnectWithoutRecipeInput | ElaborationCreateOrConnectWithoutRecipeInput[]
    createMany?: ElaborationCreateManyRecipeInputEnvelope
    connect?: ElaborationWhereUniqueInput | ElaborationWhereUniqueInput[]
  }

  export type ClientProfileUpdateOneRequiredWithoutRecipesNestedInput = {
    create?: XOR<ClientProfileCreateWithoutRecipesInput, ClientProfileUncheckedCreateWithoutRecipesInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutRecipesInput
    upsert?: ClientProfileUpsertWithoutRecipesInput
    connect?: ClientProfileWhereUniqueInput
    update?: XOR<XOR<ClientProfileUpdateToOneWithWhereWithoutRecipesInput, ClientProfileUpdateWithoutRecipesInput>, ClientProfileUncheckedUpdateWithoutRecipesInput>
  }

  export type IngredientUpdateManyWithoutRecipeNestedInput = {
    create?: XOR<IngredientCreateWithoutRecipeInput, IngredientUncheckedCreateWithoutRecipeInput> | IngredientCreateWithoutRecipeInput[] | IngredientUncheckedCreateWithoutRecipeInput[]
    connectOrCreate?: IngredientCreateOrConnectWithoutRecipeInput | IngredientCreateOrConnectWithoutRecipeInput[]
    upsert?: IngredientUpsertWithWhereUniqueWithoutRecipeInput | IngredientUpsertWithWhereUniqueWithoutRecipeInput[]
    createMany?: IngredientCreateManyRecipeInputEnvelope
    set?: IngredientWhereUniqueInput | IngredientWhereUniqueInput[]
    disconnect?: IngredientWhereUniqueInput | IngredientWhereUniqueInput[]
    delete?: IngredientWhereUniqueInput | IngredientWhereUniqueInput[]
    connect?: IngredientWhereUniqueInput | IngredientWhereUniqueInput[]
    update?: IngredientUpdateWithWhereUniqueWithoutRecipeInput | IngredientUpdateWithWhereUniqueWithoutRecipeInput[]
    updateMany?: IngredientUpdateManyWithWhereWithoutRecipeInput | IngredientUpdateManyWithWhereWithoutRecipeInput[]
    deleteMany?: IngredientScalarWhereInput | IngredientScalarWhereInput[]
  }

  export type ElaborationUpdateManyWithoutRecipeNestedInput = {
    create?: XOR<ElaborationCreateWithoutRecipeInput, ElaborationUncheckedCreateWithoutRecipeInput> | ElaborationCreateWithoutRecipeInput[] | ElaborationUncheckedCreateWithoutRecipeInput[]
    connectOrCreate?: ElaborationCreateOrConnectWithoutRecipeInput | ElaborationCreateOrConnectWithoutRecipeInput[]
    upsert?: ElaborationUpsertWithWhereUniqueWithoutRecipeInput | ElaborationUpsertWithWhereUniqueWithoutRecipeInput[]
    createMany?: ElaborationCreateManyRecipeInputEnvelope
    set?: ElaborationWhereUniqueInput | ElaborationWhereUniqueInput[]
    disconnect?: ElaborationWhereUniqueInput | ElaborationWhereUniqueInput[]
    delete?: ElaborationWhereUniqueInput | ElaborationWhereUniqueInput[]
    connect?: ElaborationWhereUniqueInput | ElaborationWhereUniqueInput[]
    update?: ElaborationUpdateWithWhereUniqueWithoutRecipeInput | ElaborationUpdateWithWhereUniqueWithoutRecipeInput[]
    updateMany?: ElaborationUpdateManyWithWhereWithoutRecipeInput | ElaborationUpdateManyWithWhereWithoutRecipeInput[]
    deleteMany?: ElaborationScalarWhereInput | ElaborationScalarWhereInput[]
  }

  export type IngredientUncheckedUpdateManyWithoutRecipeNestedInput = {
    create?: XOR<IngredientCreateWithoutRecipeInput, IngredientUncheckedCreateWithoutRecipeInput> | IngredientCreateWithoutRecipeInput[] | IngredientUncheckedCreateWithoutRecipeInput[]
    connectOrCreate?: IngredientCreateOrConnectWithoutRecipeInput | IngredientCreateOrConnectWithoutRecipeInput[]
    upsert?: IngredientUpsertWithWhereUniqueWithoutRecipeInput | IngredientUpsertWithWhereUniqueWithoutRecipeInput[]
    createMany?: IngredientCreateManyRecipeInputEnvelope
    set?: IngredientWhereUniqueInput | IngredientWhereUniqueInput[]
    disconnect?: IngredientWhereUniqueInput | IngredientWhereUniqueInput[]
    delete?: IngredientWhereUniqueInput | IngredientWhereUniqueInput[]
    connect?: IngredientWhereUniqueInput | IngredientWhereUniqueInput[]
    update?: IngredientUpdateWithWhereUniqueWithoutRecipeInput | IngredientUpdateWithWhereUniqueWithoutRecipeInput[]
    updateMany?: IngredientUpdateManyWithWhereWithoutRecipeInput | IngredientUpdateManyWithWhereWithoutRecipeInput[]
    deleteMany?: IngredientScalarWhereInput | IngredientScalarWhereInput[]
  }

  export type ElaborationUncheckedUpdateManyWithoutRecipeNestedInput = {
    create?: XOR<ElaborationCreateWithoutRecipeInput, ElaborationUncheckedCreateWithoutRecipeInput> | ElaborationCreateWithoutRecipeInput[] | ElaborationUncheckedCreateWithoutRecipeInput[]
    connectOrCreate?: ElaborationCreateOrConnectWithoutRecipeInput | ElaborationCreateOrConnectWithoutRecipeInput[]
    upsert?: ElaborationUpsertWithWhereUniqueWithoutRecipeInput | ElaborationUpsertWithWhereUniqueWithoutRecipeInput[]
    createMany?: ElaborationCreateManyRecipeInputEnvelope
    set?: ElaborationWhereUniqueInput | ElaborationWhereUniqueInput[]
    disconnect?: ElaborationWhereUniqueInput | ElaborationWhereUniqueInput[]
    delete?: ElaborationWhereUniqueInput | ElaborationWhereUniqueInput[]
    connect?: ElaborationWhereUniqueInput | ElaborationWhereUniqueInput[]
    update?: ElaborationUpdateWithWhereUniqueWithoutRecipeInput | ElaborationUpdateWithWhereUniqueWithoutRecipeInput[]
    updateMany?: ElaborationUpdateManyWithWhereWithoutRecipeInput | ElaborationUpdateManyWithWhereWithoutRecipeInput[]
    deleteMany?: ElaborationScalarWhereInput | ElaborationScalarWhereInput[]
  }

  export type RecipeCreateNestedOneWithoutIngredientsInput = {
    create?: XOR<RecipeCreateWithoutIngredientsInput, RecipeUncheckedCreateWithoutIngredientsInput>
    connectOrCreate?: RecipeCreateOrConnectWithoutIngredientsInput
    connect?: RecipeWhereUniqueInput
  }

  export type RecipeUpdateOneRequiredWithoutIngredientsNestedInput = {
    create?: XOR<RecipeCreateWithoutIngredientsInput, RecipeUncheckedCreateWithoutIngredientsInput>
    connectOrCreate?: RecipeCreateOrConnectWithoutIngredientsInput
    upsert?: RecipeUpsertWithoutIngredientsInput
    connect?: RecipeWhereUniqueInput
    update?: XOR<XOR<RecipeUpdateToOneWithWhereWithoutIngredientsInput, RecipeUpdateWithoutIngredientsInput>, RecipeUncheckedUpdateWithoutIngredientsInput>
  }

  export type RecipeCreateNestedOneWithoutElaborationsInput = {
    create?: XOR<RecipeCreateWithoutElaborationsInput, RecipeUncheckedCreateWithoutElaborationsInput>
    connectOrCreate?: RecipeCreateOrConnectWithoutElaborationsInput
    connect?: RecipeWhereUniqueInput
  }

  export type ElaborationIngredientCreateNestedManyWithoutElaborationInput = {
    create?: XOR<ElaborationIngredientCreateWithoutElaborationInput, ElaborationIngredientUncheckedCreateWithoutElaborationInput> | ElaborationIngredientCreateWithoutElaborationInput[] | ElaborationIngredientUncheckedCreateWithoutElaborationInput[]
    connectOrCreate?: ElaborationIngredientCreateOrConnectWithoutElaborationInput | ElaborationIngredientCreateOrConnectWithoutElaborationInput[]
    createMany?: ElaborationIngredientCreateManyElaborationInputEnvelope
    connect?: ElaborationIngredientWhereUniqueInput | ElaborationIngredientWhereUniqueInput[]
  }

  export type ElaborationIngredientUncheckedCreateNestedManyWithoutElaborationInput = {
    create?: XOR<ElaborationIngredientCreateWithoutElaborationInput, ElaborationIngredientUncheckedCreateWithoutElaborationInput> | ElaborationIngredientCreateWithoutElaborationInput[] | ElaborationIngredientUncheckedCreateWithoutElaborationInput[]
    connectOrCreate?: ElaborationIngredientCreateOrConnectWithoutElaborationInput | ElaborationIngredientCreateOrConnectWithoutElaborationInput[]
    createMany?: ElaborationIngredientCreateManyElaborationInputEnvelope
    connect?: ElaborationIngredientWhereUniqueInput | ElaborationIngredientWhereUniqueInput[]
  }

  export type RecipeUpdateOneRequiredWithoutElaborationsNestedInput = {
    create?: XOR<RecipeCreateWithoutElaborationsInput, RecipeUncheckedCreateWithoutElaborationsInput>
    connectOrCreate?: RecipeCreateOrConnectWithoutElaborationsInput
    upsert?: RecipeUpsertWithoutElaborationsInput
    connect?: RecipeWhereUniqueInput
    update?: XOR<XOR<RecipeUpdateToOneWithWhereWithoutElaborationsInput, RecipeUpdateWithoutElaborationsInput>, RecipeUncheckedUpdateWithoutElaborationsInput>
  }

  export type ElaborationIngredientUpdateManyWithoutElaborationNestedInput = {
    create?: XOR<ElaborationIngredientCreateWithoutElaborationInput, ElaborationIngredientUncheckedCreateWithoutElaborationInput> | ElaborationIngredientCreateWithoutElaborationInput[] | ElaborationIngredientUncheckedCreateWithoutElaborationInput[]
    connectOrCreate?: ElaborationIngredientCreateOrConnectWithoutElaborationInput | ElaborationIngredientCreateOrConnectWithoutElaborationInput[]
    upsert?: ElaborationIngredientUpsertWithWhereUniqueWithoutElaborationInput | ElaborationIngredientUpsertWithWhereUniqueWithoutElaborationInput[]
    createMany?: ElaborationIngredientCreateManyElaborationInputEnvelope
    set?: ElaborationIngredientWhereUniqueInput | ElaborationIngredientWhereUniqueInput[]
    disconnect?: ElaborationIngredientWhereUniqueInput | ElaborationIngredientWhereUniqueInput[]
    delete?: ElaborationIngredientWhereUniqueInput | ElaborationIngredientWhereUniqueInput[]
    connect?: ElaborationIngredientWhereUniqueInput | ElaborationIngredientWhereUniqueInput[]
    update?: ElaborationIngredientUpdateWithWhereUniqueWithoutElaborationInput | ElaborationIngredientUpdateWithWhereUniqueWithoutElaborationInput[]
    updateMany?: ElaborationIngredientUpdateManyWithWhereWithoutElaborationInput | ElaborationIngredientUpdateManyWithWhereWithoutElaborationInput[]
    deleteMany?: ElaborationIngredientScalarWhereInput | ElaborationIngredientScalarWhereInput[]
  }

  export type ElaborationIngredientUncheckedUpdateManyWithoutElaborationNestedInput = {
    create?: XOR<ElaborationIngredientCreateWithoutElaborationInput, ElaborationIngredientUncheckedCreateWithoutElaborationInput> | ElaborationIngredientCreateWithoutElaborationInput[] | ElaborationIngredientUncheckedCreateWithoutElaborationInput[]
    connectOrCreate?: ElaborationIngredientCreateOrConnectWithoutElaborationInput | ElaborationIngredientCreateOrConnectWithoutElaborationInput[]
    upsert?: ElaborationIngredientUpsertWithWhereUniqueWithoutElaborationInput | ElaborationIngredientUpsertWithWhereUniqueWithoutElaborationInput[]
    createMany?: ElaborationIngredientCreateManyElaborationInputEnvelope
    set?: ElaborationIngredientWhereUniqueInput | ElaborationIngredientWhereUniqueInput[]
    disconnect?: ElaborationIngredientWhereUniqueInput | ElaborationIngredientWhereUniqueInput[]
    delete?: ElaborationIngredientWhereUniqueInput | ElaborationIngredientWhereUniqueInput[]
    connect?: ElaborationIngredientWhereUniqueInput | ElaborationIngredientWhereUniqueInput[]
    update?: ElaborationIngredientUpdateWithWhereUniqueWithoutElaborationInput | ElaborationIngredientUpdateWithWhereUniqueWithoutElaborationInput[]
    updateMany?: ElaborationIngredientUpdateManyWithWhereWithoutElaborationInput | ElaborationIngredientUpdateManyWithWhereWithoutElaborationInput[]
    deleteMany?: ElaborationIngredientScalarWhereInput | ElaborationIngredientScalarWhereInput[]
  }

  export type ElaborationCreateNestedOneWithoutIngredientsInput = {
    create?: XOR<ElaborationCreateWithoutIngredientsInput, ElaborationUncheckedCreateWithoutIngredientsInput>
    connectOrCreate?: ElaborationCreateOrConnectWithoutIngredientsInput
    connect?: ElaborationWhereUniqueInput
  }

  export type ElaborationUpdateOneRequiredWithoutIngredientsNestedInput = {
    create?: XOR<ElaborationCreateWithoutIngredientsInput, ElaborationUncheckedCreateWithoutIngredientsInput>
    connectOrCreate?: ElaborationCreateOrConnectWithoutIngredientsInput
    upsert?: ElaborationUpsertWithoutIngredientsInput
    connect?: ElaborationWhereUniqueInput
    update?: XOR<XOR<ElaborationUpdateToOneWithWhereWithoutIngredientsInput, ElaborationUpdateWithoutIngredientsInput>, ElaborationUncheckedUpdateWithoutIngredientsInput>
  }

  export type ClientProfileCreateNestedOneWithoutCleaningZonesInput = {
    create?: XOR<ClientProfileCreateWithoutCleaningZonesInput, ClientProfileUncheckedCreateWithoutCleaningZonesInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutCleaningZonesInput
    connect?: ClientProfileWhereUniqueInput
  }

  export type CleaningLogZoneCreateNestedManyWithoutCleaningZoneInput = {
    create?: XOR<CleaningLogZoneCreateWithoutCleaningZoneInput, CleaningLogZoneUncheckedCreateWithoutCleaningZoneInput> | CleaningLogZoneCreateWithoutCleaningZoneInput[] | CleaningLogZoneUncheckedCreateWithoutCleaningZoneInput[]
    connectOrCreate?: CleaningLogZoneCreateOrConnectWithoutCleaningZoneInput | CleaningLogZoneCreateOrConnectWithoutCleaningZoneInput[]
    createMany?: CleaningLogZoneCreateManyCleaningZoneInputEnvelope
    connect?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
  }

  export type CleaningLogZoneUncheckedCreateNestedManyWithoutCleaningZoneInput = {
    create?: XOR<CleaningLogZoneCreateWithoutCleaningZoneInput, CleaningLogZoneUncheckedCreateWithoutCleaningZoneInput> | CleaningLogZoneCreateWithoutCleaningZoneInput[] | CleaningLogZoneUncheckedCreateWithoutCleaningZoneInput[]
    connectOrCreate?: CleaningLogZoneCreateOrConnectWithoutCleaningZoneInput | CleaningLogZoneCreateOrConnectWithoutCleaningZoneInput[]
    createMany?: CleaningLogZoneCreateManyCleaningZoneInputEnvelope
    connect?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
  }

  export type ClientProfileUpdateOneRequiredWithoutCleaningZonesNestedInput = {
    create?: XOR<ClientProfileCreateWithoutCleaningZonesInput, ClientProfileUncheckedCreateWithoutCleaningZonesInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutCleaningZonesInput
    upsert?: ClientProfileUpsertWithoutCleaningZonesInput
    connect?: ClientProfileWhereUniqueInput
    update?: XOR<XOR<ClientProfileUpdateToOneWithWhereWithoutCleaningZonesInput, ClientProfileUpdateWithoutCleaningZonesInput>, ClientProfileUncheckedUpdateWithoutCleaningZonesInput>
  }

  export type CleaningLogZoneUpdateManyWithoutCleaningZoneNestedInput = {
    create?: XOR<CleaningLogZoneCreateWithoutCleaningZoneInput, CleaningLogZoneUncheckedCreateWithoutCleaningZoneInput> | CleaningLogZoneCreateWithoutCleaningZoneInput[] | CleaningLogZoneUncheckedCreateWithoutCleaningZoneInput[]
    connectOrCreate?: CleaningLogZoneCreateOrConnectWithoutCleaningZoneInput | CleaningLogZoneCreateOrConnectWithoutCleaningZoneInput[]
    upsert?: CleaningLogZoneUpsertWithWhereUniqueWithoutCleaningZoneInput | CleaningLogZoneUpsertWithWhereUniqueWithoutCleaningZoneInput[]
    createMany?: CleaningLogZoneCreateManyCleaningZoneInputEnvelope
    set?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    disconnect?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    delete?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    connect?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    update?: CleaningLogZoneUpdateWithWhereUniqueWithoutCleaningZoneInput | CleaningLogZoneUpdateWithWhereUniqueWithoutCleaningZoneInput[]
    updateMany?: CleaningLogZoneUpdateManyWithWhereWithoutCleaningZoneInput | CleaningLogZoneUpdateManyWithWhereWithoutCleaningZoneInput[]
    deleteMany?: CleaningLogZoneScalarWhereInput | CleaningLogZoneScalarWhereInput[]
  }

  export type CleaningLogZoneUncheckedUpdateManyWithoutCleaningZoneNestedInput = {
    create?: XOR<CleaningLogZoneCreateWithoutCleaningZoneInput, CleaningLogZoneUncheckedCreateWithoutCleaningZoneInput> | CleaningLogZoneCreateWithoutCleaningZoneInput[] | CleaningLogZoneUncheckedCreateWithoutCleaningZoneInput[]
    connectOrCreate?: CleaningLogZoneCreateOrConnectWithoutCleaningZoneInput | CleaningLogZoneCreateOrConnectWithoutCleaningZoneInput[]
    upsert?: CleaningLogZoneUpsertWithWhereUniqueWithoutCleaningZoneInput | CleaningLogZoneUpsertWithWhereUniqueWithoutCleaningZoneInput[]
    createMany?: CleaningLogZoneCreateManyCleaningZoneInputEnvelope
    set?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    disconnect?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    delete?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    connect?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    update?: CleaningLogZoneUpdateWithWhereUniqueWithoutCleaningZoneInput | CleaningLogZoneUpdateWithWhereUniqueWithoutCleaningZoneInput[]
    updateMany?: CleaningLogZoneUpdateManyWithWhereWithoutCleaningZoneInput | CleaningLogZoneUpdateManyWithWhereWithoutCleaningZoneInput[]
    deleteMany?: CleaningLogZoneScalarWhereInput | CleaningLogZoneScalarWhereInput[]
  }

  export type ClientProfileCreateNestedOneWithoutCleaningLogsInput = {
    create?: XOR<ClientProfileCreateWithoutCleaningLogsInput, ClientProfileUncheckedCreateWithoutCleaningLogsInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutCleaningLogsInput
    connect?: ClientProfileWhereUniqueInput
  }

  export type CleaningLogZoneCreateNestedManyWithoutCleaningLogInput = {
    create?: XOR<CleaningLogZoneCreateWithoutCleaningLogInput, CleaningLogZoneUncheckedCreateWithoutCleaningLogInput> | CleaningLogZoneCreateWithoutCleaningLogInput[] | CleaningLogZoneUncheckedCreateWithoutCleaningLogInput[]
    connectOrCreate?: CleaningLogZoneCreateOrConnectWithoutCleaningLogInput | CleaningLogZoneCreateOrConnectWithoutCleaningLogInput[]
    createMany?: CleaningLogZoneCreateManyCleaningLogInputEnvelope
    connect?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
  }

  export type CleaningLogZoneUncheckedCreateNestedManyWithoutCleaningLogInput = {
    create?: XOR<CleaningLogZoneCreateWithoutCleaningLogInput, CleaningLogZoneUncheckedCreateWithoutCleaningLogInput> | CleaningLogZoneCreateWithoutCleaningLogInput[] | CleaningLogZoneUncheckedCreateWithoutCleaningLogInput[]
    connectOrCreate?: CleaningLogZoneCreateOrConnectWithoutCleaningLogInput | CleaningLogZoneCreateOrConnectWithoutCleaningLogInput[]
    createMany?: CleaningLogZoneCreateManyCleaningLogInputEnvelope
    connect?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
  }

  export type ClientProfileUpdateOneRequiredWithoutCleaningLogsNestedInput = {
    create?: XOR<ClientProfileCreateWithoutCleaningLogsInput, ClientProfileUncheckedCreateWithoutCleaningLogsInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutCleaningLogsInput
    upsert?: ClientProfileUpsertWithoutCleaningLogsInput
    connect?: ClientProfileWhereUniqueInput
    update?: XOR<XOR<ClientProfileUpdateToOneWithWhereWithoutCleaningLogsInput, ClientProfileUpdateWithoutCleaningLogsInput>, ClientProfileUncheckedUpdateWithoutCleaningLogsInput>
  }

  export type CleaningLogZoneUpdateManyWithoutCleaningLogNestedInput = {
    create?: XOR<CleaningLogZoneCreateWithoutCleaningLogInput, CleaningLogZoneUncheckedCreateWithoutCleaningLogInput> | CleaningLogZoneCreateWithoutCleaningLogInput[] | CleaningLogZoneUncheckedCreateWithoutCleaningLogInput[]
    connectOrCreate?: CleaningLogZoneCreateOrConnectWithoutCleaningLogInput | CleaningLogZoneCreateOrConnectWithoutCleaningLogInput[]
    upsert?: CleaningLogZoneUpsertWithWhereUniqueWithoutCleaningLogInput | CleaningLogZoneUpsertWithWhereUniqueWithoutCleaningLogInput[]
    createMany?: CleaningLogZoneCreateManyCleaningLogInputEnvelope
    set?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    disconnect?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    delete?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    connect?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    update?: CleaningLogZoneUpdateWithWhereUniqueWithoutCleaningLogInput | CleaningLogZoneUpdateWithWhereUniqueWithoutCleaningLogInput[]
    updateMany?: CleaningLogZoneUpdateManyWithWhereWithoutCleaningLogInput | CleaningLogZoneUpdateManyWithWhereWithoutCleaningLogInput[]
    deleteMany?: CleaningLogZoneScalarWhereInput | CleaningLogZoneScalarWhereInput[]
  }

  export type CleaningLogZoneUncheckedUpdateManyWithoutCleaningLogNestedInput = {
    create?: XOR<CleaningLogZoneCreateWithoutCleaningLogInput, CleaningLogZoneUncheckedCreateWithoutCleaningLogInput> | CleaningLogZoneCreateWithoutCleaningLogInput[] | CleaningLogZoneUncheckedCreateWithoutCleaningLogInput[]
    connectOrCreate?: CleaningLogZoneCreateOrConnectWithoutCleaningLogInput | CleaningLogZoneCreateOrConnectWithoutCleaningLogInput[]
    upsert?: CleaningLogZoneUpsertWithWhereUniqueWithoutCleaningLogInput | CleaningLogZoneUpsertWithWhereUniqueWithoutCleaningLogInput[]
    createMany?: CleaningLogZoneCreateManyCleaningLogInputEnvelope
    set?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    disconnect?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    delete?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    connect?: CleaningLogZoneWhereUniqueInput | CleaningLogZoneWhereUniqueInput[]
    update?: CleaningLogZoneUpdateWithWhereUniqueWithoutCleaningLogInput | CleaningLogZoneUpdateWithWhereUniqueWithoutCleaningLogInput[]
    updateMany?: CleaningLogZoneUpdateManyWithWhereWithoutCleaningLogInput | CleaningLogZoneUpdateManyWithWhereWithoutCleaningLogInput[]
    deleteMany?: CleaningLogZoneScalarWhereInput | CleaningLogZoneScalarWhereInput[]
  }

  export type CleaningLogCreateNestedOneWithoutZonesInput = {
    create?: XOR<CleaningLogCreateWithoutZonesInput, CleaningLogUncheckedCreateWithoutZonesInput>
    connectOrCreate?: CleaningLogCreateOrConnectWithoutZonesInput
    connect?: CleaningLogWhereUniqueInput
  }

  export type CleaningZoneCreateNestedOneWithoutLogsInput = {
    create?: XOR<CleaningZoneCreateWithoutLogsInput, CleaningZoneUncheckedCreateWithoutLogsInput>
    connectOrCreate?: CleaningZoneCreateOrConnectWithoutLogsInput
    connect?: CleaningZoneWhereUniqueInput
  }

  export type CleaningLogUpdateOneRequiredWithoutZonesNestedInput = {
    create?: XOR<CleaningLogCreateWithoutZonesInput, CleaningLogUncheckedCreateWithoutZonesInput>
    connectOrCreate?: CleaningLogCreateOrConnectWithoutZonesInput
    upsert?: CleaningLogUpsertWithoutZonesInput
    connect?: CleaningLogWhereUniqueInput
    update?: XOR<XOR<CleaningLogUpdateToOneWithWhereWithoutZonesInput, CleaningLogUpdateWithoutZonesInput>, CleaningLogUncheckedUpdateWithoutZonesInput>
  }

  export type CleaningZoneUpdateOneRequiredWithoutLogsNestedInput = {
    create?: XOR<CleaningZoneCreateWithoutLogsInput, CleaningZoneUncheckedCreateWithoutLogsInput>
    connectOrCreate?: CleaningZoneCreateOrConnectWithoutLogsInput
    upsert?: CleaningZoneUpsertWithoutLogsInput
    connect?: CleaningZoneWhereUniqueInput
    update?: XOR<XOR<CleaningZoneUpdateToOneWithWhereWithoutLogsInput, CleaningZoneUpdateWithoutLogsInput>, CleaningZoneUncheckedUpdateWithoutLogsInput>
  }

  export type ClientProfileCreateNestedOneWithoutChambersInput = {
    create?: XOR<ClientProfileCreateWithoutChambersInput, ClientProfileUncheckedCreateWithoutChambersInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutChambersInput
    connect?: ClientProfileWhereUniqueInput
  }

  export type TemperatureValueCreateNestedManyWithoutChamberInput = {
    create?: XOR<TemperatureValueCreateWithoutChamberInput, TemperatureValueUncheckedCreateWithoutChamberInput> | TemperatureValueCreateWithoutChamberInput[] | TemperatureValueUncheckedCreateWithoutChamberInput[]
    connectOrCreate?: TemperatureValueCreateOrConnectWithoutChamberInput | TemperatureValueCreateOrConnectWithoutChamberInput[]
    createMany?: TemperatureValueCreateManyChamberInputEnvelope
    connect?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
  }

  export type TemperatureValueUncheckedCreateNestedManyWithoutChamberInput = {
    create?: XOR<TemperatureValueCreateWithoutChamberInput, TemperatureValueUncheckedCreateWithoutChamberInput> | TemperatureValueCreateWithoutChamberInput[] | TemperatureValueUncheckedCreateWithoutChamberInput[]
    connectOrCreate?: TemperatureValueCreateOrConnectWithoutChamberInput | TemperatureValueCreateOrConnectWithoutChamberInput[]
    createMany?: TemperatureValueCreateManyChamberInputEnvelope
    connect?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
  }

  export type ClientProfileUpdateOneRequiredWithoutChambersNestedInput = {
    create?: XOR<ClientProfileCreateWithoutChambersInput, ClientProfileUncheckedCreateWithoutChambersInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutChambersInput
    upsert?: ClientProfileUpsertWithoutChambersInput
    connect?: ClientProfileWhereUniqueInput
    update?: XOR<XOR<ClientProfileUpdateToOneWithWhereWithoutChambersInput, ClientProfileUpdateWithoutChambersInput>, ClientProfileUncheckedUpdateWithoutChambersInput>
  }

  export type TemperatureValueUpdateManyWithoutChamberNestedInput = {
    create?: XOR<TemperatureValueCreateWithoutChamberInput, TemperatureValueUncheckedCreateWithoutChamberInput> | TemperatureValueCreateWithoutChamberInput[] | TemperatureValueUncheckedCreateWithoutChamberInput[]
    connectOrCreate?: TemperatureValueCreateOrConnectWithoutChamberInput | TemperatureValueCreateOrConnectWithoutChamberInput[]
    upsert?: TemperatureValueUpsertWithWhereUniqueWithoutChamberInput | TemperatureValueUpsertWithWhereUniqueWithoutChamberInput[]
    createMany?: TemperatureValueCreateManyChamberInputEnvelope
    set?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    disconnect?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    delete?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    connect?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    update?: TemperatureValueUpdateWithWhereUniqueWithoutChamberInput | TemperatureValueUpdateWithWhereUniqueWithoutChamberInput[]
    updateMany?: TemperatureValueUpdateManyWithWhereWithoutChamberInput | TemperatureValueUpdateManyWithWhereWithoutChamberInput[]
    deleteMany?: TemperatureValueScalarWhereInput | TemperatureValueScalarWhereInput[]
  }

  export type TemperatureValueUncheckedUpdateManyWithoutChamberNestedInput = {
    create?: XOR<TemperatureValueCreateWithoutChamberInput, TemperatureValueUncheckedCreateWithoutChamberInput> | TemperatureValueCreateWithoutChamberInput[] | TemperatureValueUncheckedCreateWithoutChamberInput[]
    connectOrCreate?: TemperatureValueCreateOrConnectWithoutChamberInput | TemperatureValueCreateOrConnectWithoutChamberInput[]
    upsert?: TemperatureValueUpsertWithWhereUniqueWithoutChamberInput | TemperatureValueUpsertWithWhereUniqueWithoutChamberInput[]
    createMany?: TemperatureValueCreateManyChamberInputEnvelope
    set?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    disconnect?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    delete?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    connect?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    update?: TemperatureValueUpdateWithWhereUniqueWithoutChamberInput | TemperatureValueUpdateWithWhereUniqueWithoutChamberInput[]
    updateMany?: TemperatureValueUpdateManyWithWhereWithoutChamberInput | TemperatureValueUpdateManyWithWhereWithoutChamberInput[]
    deleteMany?: TemperatureValueScalarWhereInput | TemperatureValueScalarWhereInput[]
  }

  export type ClientProfileCreateNestedOneWithoutTemperatureRecordsInput = {
    create?: XOR<ClientProfileCreateWithoutTemperatureRecordsInput, ClientProfileUncheckedCreateWithoutTemperatureRecordsInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutTemperatureRecordsInput
    connect?: ClientProfileWhereUniqueInput
  }

  export type TemperatureValueCreateNestedManyWithoutRecordInput = {
    create?: XOR<TemperatureValueCreateWithoutRecordInput, TemperatureValueUncheckedCreateWithoutRecordInput> | TemperatureValueCreateWithoutRecordInput[] | TemperatureValueUncheckedCreateWithoutRecordInput[]
    connectOrCreate?: TemperatureValueCreateOrConnectWithoutRecordInput | TemperatureValueCreateOrConnectWithoutRecordInput[]
    createMany?: TemperatureValueCreateManyRecordInputEnvelope
    connect?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
  }

  export type TemperatureValueUncheckedCreateNestedManyWithoutRecordInput = {
    create?: XOR<TemperatureValueCreateWithoutRecordInput, TemperatureValueUncheckedCreateWithoutRecordInput> | TemperatureValueCreateWithoutRecordInput[] | TemperatureValueUncheckedCreateWithoutRecordInput[]
    connectOrCreate?: TemperatureValueCreateOrConnectWithoutRecordInput | TemperatureValueCreateOrConnectWithoutRecordInput[]
    createMany?: TemperatureValueCreateManyRecordInputEnvelope
    connect?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
  }

  export type ClientProfileUpdateOneRequiredWithoutTemperatureRecordsNestedInput = {
    create?: XOR<ClientProfileCreateWithoutTemperatureRecordsInput, ClientProfileUncheckedCreateWithoutTemperatureRecordsInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutTemperatureRecordsInput
    upsert?: ClientProfileUpsertWithoutTemperatureRecordsInput
    connect?: ClientProfileWhereUniqueInput
    update?: XOR<XOR<ClientProfileUpdateToOneWithWhereWithoutTemperatureRecordsInput, ClientProfileUpdateWithoutTemperatureRecordsInput>, ClientProfileUncheckedUpdateWithoutTemperatureRecordsInput>
  }

  export type TemperatureValueUpdateManyWithoutRecordNestedInput = {
    create?: XOR<TemperatureValueCreateWithoutRecordInput, TemperatureValueUncheckedCreateWithoutRecordInput> | TemperatureValueCreateWithoutRecordInput[] | TemperatureValueUncheckedCreateWithoutRecordInput[]
    connectOrCreate?: TemperatureValueCreateOrConnectWithoutRecordInput | TemperatureValueCreateOrConnectWithoutRecordInput[]
    upsert?: TemperatureValueUpsertWithWhereUniqueWithoutRecordInput | TemperatureValueUpsertWithWhereUniqueWithoutRecordInput[]
    createMany?: TemperatureValueCreateManyRecordInputEnvelope
    set?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    disconnect?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    delete?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    connect?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    update?: TemperatureValueUpdateWithWhereUniqueWithoutRecordInput | TemperatureValueUpdateWithWhereUniqueWithoutRecordInput[]
    updateMany?: TemperatureValueUpdateManyWithWhereWithoutRecordInput | TemperatureValueUpdateManyWithWhereWithoutRecordInput[]
    deleteMany?: TemperatureValueScalarWhereInput | TemperatureValueScalarWhereInput[]
  }

  export type TemperatureValueUncheckedUpdateManyWithoutRecordNestedInput = {
    create?: XOR<TemperatureValueCreateWithoutRecordInput, TemperatureValueUncheckedCreateWithoutRecordInput> | TemperatureValueCreateWithoutRecordInput[] | TemperatureValueUncheckedCreateWithoutRecordInput[]
    connectOrCreate?: TemperatureValueCreateOrConnectWithoutRecordInput | TemperatureValueCreateOrConnectWithoutRecordInput[]
    upsert?: TemperatureValueUpsertWithWhereUniqueWithoutRecordInput | TemperatureValueUpsertWithWhereUniqueWithoutRecordInput[]
    createMany?: TemperatureValueCreateManyRecordInputEnvelope
    set?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    disconnect?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    delete?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    connect?: TemperatureValueWhereUniqueInput | TemperatureValueWhereUniqueInput[]
    update?: TemperatureValueUpdateWithWhereUniqueWithoutRecordInput | TemperatureValueUpdateWithWhereUniqueWithoutRecordInput[]
    updateMany?: TemperatureValueUpdateManyWithWhereWithoutRecordInput | TemperatureValueUpdateManyWithWhereWithoutRecordInput[]
    deleteMany?: TemperatureValueScalarWhereInput | TemperatureValueScalarWhereInput[]
  }

  export type ChamberCreateNestedOneWithoutValuesInput = {
    create?: XOR<ChamberCreateWithoutValuesInput, ChamberUncheckedCreateWithoutValuesInput>
    connectOrCreate?: ChamberCreateOrConnectWithoutValuesInput
    connect?: ChamberWhereUniqueInput
  }

  export type TemperatureRecordCreateNestedOneWithoutValuesInput = {
    create?: XOR<TemperatureRecordCreateWithoutValuesInput, TemperatureRecordUncheckedCreateWithoutValuesInput>
    connectOrCreate?: TemperatureRecordCreateOrConnectWithoutValuesInput
    connect?: TemperatureRecordWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ChamberUpdateOneRequiredWithoutValuesNestedInput = {
    create?: XOR<ChamberCreateWithoutValuesInput, ChamberUncheckedCreateWithoutValuesInput>
    connectOrCreate?: ChamberCreateOrConnectWithoutValuesInput
    upsert?: ChamberUpsertWithoutValuesInput
    connect?: ChamberWhereUniqueInput
    update?: XOR<XOR<ChamberUpdateToOneWithWhereWithoutValuesInput, ChamberUpdateWithoutValuesInput>, ChamberUncheckedUpdateWithoutValuesInput>
  }

  export type TemperatureRecordUpdateOneRequiredWithoutValuesNestedInput = {
    create?: XOR<TemperatureRecordCreateWithoutValuesInput, TemperatureRecordUncheckedCreateWithoutValuesInput>
    connectOrCreate?: TemperatureRecordCreateOrConnectWithoutValuesInput
    upsert?: TemperatureRecordUpsertWithoutValuesInput
    connect?: TemperatureRecordWhereUniqueInput
    update?: XOR<XOR<TemperatureRecordUpdateToOneWithWhereWithoutValuesInput, TemperatureRecordUpdateWithoutValuesInput>, TemperatureRecordUncheckedUpdateWithoutValuesInput>
  }

  export type ClientProfileCreateNestedOneWithoutGoodsReceiptsInput = {
    create?: XOR<ClientProfileCreateWithoutGoodsReceiptsInput, ClientProfileUncheckedCreateWithoutGoodsReceiptsInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutGoodsReceiptsInput
    connect?: ClientProfileWhereUniqueInput
  }

  export type ClientProfileUpdateOneRequiredWithoutGoodsReceiptsNestedInput = {
    create?: XOR<ClientProfileCreateWithoutGoodsReceiptsInput, ClientProfileUncheckedCreateWithoutGoodsReceiptsInput>
    connectOrCreate?: ClientProfileCreateOrConnectWithoutGoodsReceiptsInput
    upsert?: ClientProfileUpsertWithoutGoodsReceiptsInput
    connect?: ClientProfileWhereUniqueInput
    update?: XOR<XOR<ClientProfileUpdateToOneWithWhereWithoutGoodsReceiptsInput, ClientProfileUpdateWithoutGoodsReceiptsInput>, ClientProfileUncheckedUpdateWithoutGoodsReceiptsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ClientProfileCreateWithoutUserInput = {
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    recipes?: RecipeCreateNestedManyWithoutClientProfileInput
    cleaningZones?: CleaningZoneCreateNestedManyWithoutClientProfileInput
    cleaningLogs?: CleaningLogCreateNestedManyWithoutClientProfileInput
    chambers?: ChamberCreateNestedManyWithoutClientProfileInput
    temperatureRecords?: TemperatureRecordCreateNestedManyWithoutClientProfileInput
    goodsReceipts?: GoodsReceiptCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileUncheckedCreateWithoutUserInput = {
    id?: number
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    recipes?: RecipeUncheckedCreateNestedManyWithoutClientProfileInput
    cleaningZones?: CleaningZoneUncheckedCreateNestedManyWithoutClientProfileInput
    cleaningLogs?: CleaningLogUncheckedCreateNestedManyWithoutClientProfileInput
    chambers?: ChamberUncheckedCreateNestedManyWithoutClientProfileInput
    temperatureRecords?: TemperatureRecordUncheckedCreateNestedManyWithoutClientProfileInput
    goodsReceipts?: GoodsReceiptUncheckedCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileCreateOrConnectWithoutUserInput = {
    where: ClientProfileWhereUniqueInput
    create: XOR<ClientProfileCreateWithoutUserInput, ClientProfileUncheckedCreateWithoutUserInput>
  }

  export type ClientProfileUpsertWithoutUserInput = {
    update: XOR<ClientProfileUpdateWithoutUserInput, ClientProfileUncheckedUpdateWithoutUserInput>
    create: XOR<ClientProfileCreateWithoutUserInput, ClientProfileUncheckedCreateWithoutUserInput>
    where?: ClientProfileWhereInput
  }

  export type ClientProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: ClientProfileWhereInput
    data: XOR<ClientProfileUpdateWithoutUserInput, ClientProfileUncheckedUpdateWithoutUserInput>
  }

  export type ClientProfileUpdateWithoutUserInput = {
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipes?: RecipeUpdateManyWithoutClientProfileNestedInput
    cleaningZones?: CleaningZoneUpdateManyWithoutClientProfileNestedInput
    cleaningLogs?: CleaningLogUpdateManyWithoutClientProfileNestedInput
    chambers?: ChamberUpdateManyWithoutClientProfileNestedInput
    temperatureRecords?: TemperatureRecordUpdateManyWithoutClientProfileNestedInput
    goodsReceipts?: GoodsReceiptUpdateManyWithoutClientProfileNestedInput
  }

  export type ClientProfileUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipes?: RecipeUncheckedUpdateManyWithoutClientProfileNestedInput
    cleaningZones?: CleaningZoneUncheckedUpdateManyWithoutClientProfileNestedInput
    cleaningLogs?: CleaningLogUncheckedUpdateManyWithoutClientProfileNestedInput
    chambers?: ChamberUncheckedUpdateManyWithoutClientProfileNestedInput
    temperatureRecords?: TemperatureRecordUncheckedUpdateManyWithoutClientProfileNestedInput
    goodsReceipts?: GoodsReceiptUncheckedUpdateManyWithoutClientProfileNestedInput
  }

  export type UserCreateWithoutClientProfileInput = {
    email: string
    password: string
    name?: string | null
    role?: string
    emailVerified?: boolean
    verificationToken?: string | null
    verificationTokenExpires?: Date | string | null
    resetPasswordToken?: string | null
    resetPasswordExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutClientProfileInput = {
    id?: number
    email: string
    password: string
    name?: string | null
    role?: string
    emailVerified?: boolean
    verificationToken?: string | null
    verificationTokenExpires?: Date | string | null
    resetPasswordToken?: string | null
    resetPasswordExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutClientProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutClientProfileInput, UserUncheckedCreateWithoutClientProfileInput>
  }

  export type RecipeCreateWithoutClientProfileInput = {
    name: string
    lotesMandatory?: boolean
    quantitiesMandatory?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    ingredients?: IngredientCreateNestedManyWithoutRecipeInput
    elaborations?: ElaborationCreateNestedManyWithoutRecipeInput
  }

  export type RecipeUncheckedCreateWithoutClientProfileInput = {
    id?: number
    name: string
    lotesMandatory?: boolean
    quantitiesMandatory?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    ingredients?: IngredientUncheckedCreateNestedManyWithoutRecipeInput
    elaborations?: ElaborationUncheckedCreateNestedManyWithoutRecipeInput
  }

  export type RecipeCreateOrConnectWithoutClientProfileInput = {
    where: RecipeWhereUniqueInput
    create: XOR<RecipeCreateWithoutClientProfileInput, RecipeUncheckedCreateWithoutClientProfileInput>
  }

  export type RecipeCreateManyClientProfileInputEnvelope = {
    data: RecipeCreateManyClientProfileInput | RecipeCreateManyClientProfileInput[]
  }

  export type CleaningZoneCreateWithoutClientProfileInput = {
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    logs?: CleaningLogZoneCreateNestedManyWithoutCleaningZoneInput
  }

  export type CleaningZoneUncheckedCreateWithoutClientProfileInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    logs?: CleaningLogZoneUncheckedCreateNestedManyWithoutCleaningZoneInput
  }

  export type CleaningZoneCreateOrConnectWithoutClientProfileInput = {
    where: CleaningZoneWhereUniqueInput
    create: XOR<CleaningZoneCreateWithoutClientProfileInput, CleaningZoneUncheckedCreateWithoutClientProfileInput>
  }

  export type CleaningZoneCreateManyClientProfileInputEnvelope = {
    data: CleaningZoneCreateManyClientProfileInput | CleaningZoneCreateManyClientProfileInput[]
  }

  export type CleaningLogCreateWithoutClientProfileInput = {
    personName: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    zones?: CleaningLogZoneCreateNestedManyWithoutCleaningLogInput
  }

  export type CleaningLogUncheckedCreateWithoutClientProfileInput = {
    id?: number
    personName: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    zones?: CleaningLogZoneUncheckedCreateNestedManyWithoutCleaningLogInput
  }

  export type CleaningLogCreateOrConnectWithoutClientProfileInput = {
    where: CleaningLogWhereUniqueInput
    create: XOR<CleaningLogCreateWithoutClientProfileInput, CleaningLogUncheckedCreateWithoutClientProfileInput>
  }

  export type CleaningLogCreateManyClientProfileInputEnvelope = {
    data: CleaningLogCreateManyClientProfileInput | CleaningLogCreateManyClientProfileInput[]
  }

  export type ChamberCreateWithoutClientProfileInput = {
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    values?: TemperatureValueCreateNestedManyWithoutChamberInput
  }

  export type ChamberUncheckedCreateWithoutClientProfileInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    values?: TemperatureValueUncheckedCreateNestedManyWithoutChamberInput
  }

  export type ChamberCreateOrConnectWithoutClientProfileInput = {
    where: ChamberWhereUniqueInput
    create: XOR<ChamberCreateWithoutClientProfileInput, ChamberUncheckedCreateWithoutClientProfileInput>
  }

  export type ChamberCreateManyClientProfileInputEnvelope = {
    data: ChamberCreateManyClientProfileInput | ChamberCreateManyClientProfileInput[]
  }

  export type TemperatureRecordCreateWithoutClientProfileInput = {
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    values?: TemperatureValueCreateNestedManyWithoutRecordInput
  }

  export type TemperatureRecordUncheckedCreateWithoutClientProfileInput = {
    id?: number
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    values?: TemperatureValueUncheckedCreateNestedManyWithoutRecordInput
  }

  export type TemperatureRecordCreateOrConnectWithoutClientProfileInput = {
    where: TemperatureRecordWhereUniqueInput
    create: XOR<TemperatureRecordCreateWithoutClientProfileInput, TemperatureRecordUncheckedCreateWithoutClientProfileInput>
  }

  export type TemperatureRecordCreateManyClientProfileInputEnvelope = {
    data: TemperatureRecordCreateManyClientProfileInput | TemperatureRecordCreateManyClientProfileInput[]
  }

  export type GoodsReceiptCreateWithoutClientProfileInput = {
    providerName?: string | null
    productName: string
    lote?: string | null
    invoiceNumber?: string | null
    quantity?: string | null
    date?: Date | string
    deliveryNoteImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoodsReceiptUncheckedCreateWithoutClientProfileInput = {
    id?: number
    providerName?: string | null
    productName: string
    lote?: string | null
    invoiceNumber?: string | null
    quantity?: string | null
    date?: Date | string
    deliveryNoteImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoodsReceiptCreateOrConnectWithoutClientProfileInput = {
    where: GoodsReceiptWhereUniqueInput
    create: XOR<GoodsReceiptCreateWithoutClientProfileInput, GoodsReceiptUncheckedCreateWithoutClientProfileInput>
  }

  export type GoodsReceiptCreateManyClientProfileInputEnvelope = {
    data: GoodsReceiptCreateManyClientProfileInput | GoodsReceiptCreateManyClientProfileInput[]
  }

  export type UserUpsertWithoutClientProfileInput = {
    update: XOR<UserUpdateWithoutClientProfileInput, UserUncheckedUpdateWithoutClientProfileInput>
    create: XOR<UserCreateWithoutClientProfileInput, UserUncheckedCreateWithoutClientProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutClientProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutClientProfileInput, UserUncheckedUpdateWithoutClientProfileInput>
  }

  export type UserUpdateWithoutClientProfileInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutClientProfileInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecipeUpsertWithWhereUniqueWithoutClientProfileInput = {
    where: RecipeWhereUniqueInput
    update: XOR<RecipeUpdateWithoutClientProfileInput, RecipeUncheckedUpdateWithoutClientProfileInput>
    create: XOR<RecipeCreateWithoutClientProfileInput, RecipeUncheckedCreateWithoutClientProfileInput>
  }

  export type RecipeUpdateWithWhereUniqueWithoutClientProfileInput = {
    where: RecipeWhereUniqueInput
    data: XOR<RecipeUpdateWithoutClientProfileInput, RecipeUncheckedUpdateWithoutClientProfileInput>
  }

  export type RecipeUpdateManyWithWhereWithoutClientProfileInput = {
    where: RecipeScalarWhereInput
    data: XOR<RecipeUpdateManyMutationInput, RecipeUncheckedUpdateManyWithoutClientProfileInput>
  }

  export type RecipeScalarWhereInput = {
    AND?: RecipeScalarWhereInput | RecipeScalarWhereInput[]
    OR?: RecipeScalarWhereInput[]
    NOT?: RecipeScalarWhereInput | RecipeScalarWhereInput[]
    id?: IntFilter<"Recipe"> | number
    name?: StringFilter<"Recipe"> | string
    clientProfileId?: IntFilter<"Recipe"> | number
    lotesMandatory?: BoolFilter<"Recipe"> | boolean
    quantitiesMandatory?: BoolFilter<"Recipe"> | boolean
    createdAt?: DateTimeFilter<"Recipe"> | Date | string
    updatedAt?: DateTimeFilter<"Recipe"> | Date | string
  }

  export type CleaningZoneUpsertWithWhereUniqueWithoutClientProfileInput = {
    where: CleaningZoneWhereUniqueInput
    update: XOR<CleaningZoneUpdateWithoutClientProfileInput, CleaningZoneUncheckedUpdateWithoutClientProfileInput>
    create: XOR<CleaningZoneCreateWithoutClientProfileInput, CleaningZoneUncheckedCreateWithoutClientProfileInput>
  }

  export type CleaningZoneUpdateWithWhereUniqueWithoutClientProfileInput = {
    where: CleaningZoneWhereUniqueInput
    data: XOR<CleaningZoneUpdateWithoutClientProfileInput, CleaningZoneUncheckedUpdateWithoutClientProfileInput>
  }

  export type CleaningZoneUpdateManyWithWhereWithoutClientProfileInput = {
    where: CleaningZoneScalarWhereInput
    data: XOR<CleaningZoneUpdateManyMutationInput, CleaningZoneUncheckedUpdateManyWithoutClientProfileInput>
  }

  export type CleaningZoneScalarWhereInput = {
    AND?: CleaningZoneScalarWhereInput | CleaningZoneScalarWhereInput[]
    OR?: CleaningZoneScalarWhereInput[]
    NOT?: CleaningZoneScalarWhereInput | CleaningZoneScalarWhereInput[]
    id?: IntFilter<"CleaningZone"> | number
    name?: StringFilter<"CleaningZone"> | string
    clientProfileId?: IntFilter<"CleaningZone"> | number
    createdAt?: DateTimeFilter<"CleaningZone"> | Date | string
    updatedAt?: DateTimeFilter<"CleaningZone"> | Date | string
  }

  export type CleaningLogUpsertWithWhereUniqueWithoutClientProfileInput = {
    where: CleaningLogWhereUniqueInput
    update: XOR<CleaningLogUpdateWithoutClientProfileInput, CleaningLogUncheckedUpdateWithoutClientProfileInput>
    create: XOR<CleaningLogCreateWithoutClientProfileInput, CleaningLogUncheckedCreateWithoutClientProfileInput>
  }

  export type CleaningLogUpdateWithWhereUniqueWithoutClientProfileInput = {
    where: CleaningLogWhereUniqueInput
    data: XOR<CleaningLogUpdateWithoutClientProfileInput, CleaningLogUncheckedUpdateWithoutClientProfileInput>
  }

  export type CleaningLogUpdateManyWithWhereWithoutClientProfileInput = {
    where: CleaningLogScalarWhereInput
    data: XOR<CleaningLogUpdateManyMutationInput, CleaningLogUncheckedUpdateManyWithoutClientProfileInput>
  }

  export type CleaningLogScalarWhereInput = {
    AND?: CleaningLogScalarWhereInput | CleaningLogScalarWhereInput[]
    OR?: CleaningLogScalarWhereInput[]
    NOT?: CleaningLogScalarWhereInput | CleaningLogScalarWhereInput[]
    id?: IntFilter<"CleaningLog"> | number
    personName?: StringFilter<"CleaningLog"> | string
    date?: DateTimeFilter<"CleaningLog"> | Date | string
    clientProfileId?: IntFilter<"CleaningLog"> | number
    createdAt?: DateTimeFilter<"CleaningLog"> | Date | string
    updatedAt?: DateTimeFilter<"CleaningLog"> | Date | string
  }

  export type ChamberUpsertWithWhereUniqueWithoutClientProfileInput = {
    where: ChamberWhereUniqueInput
    update: XOR<ChamberUpdateWithoutClientProfileInput, ChamberUncheckedUpdateWithoutClientProfileInput>
    create: XOR<ChamberCreateWithoutClientProfileInput, ChamberUncheckedCreateWithoutClientProfileInput>
  }

  export type ChamberUpdateWithWhereUniqueWithoutClientProfileInput = {
    where: ChamberWhereUniqueInput
    data: XOR<ChamberUpdateWithoutClientProfileInput, ChamberUncheckedUpdateWithoutClientProfileInput>
  }

  export type ChamberUpdateManyWithWhereWithoutClientProfileInput = {
    where: ChamberScalarWhereInput
    data: XOR<ChamberUpdateManyMutationInput, ChamberUncheckedUpdateManyWithoutClientProfileInput>
  }

  export type ChamberScalarWhereInput = {
    AND?: ChamberScalarWhereInput | ChamberScalarWhereInput[]
    OR?: ChamberScalarWhereInput[]
    NOT?: ChamberScalarWhereInput | ChamberScalarWhereInput[]
    id?: IntFilter<"Chamber"> | number
    name?: StringFilter<"Chamber"> | string
    clientProfileId?: IntFilter<"Chamber"> | number
    createdAt?: DateTimeFilter<"Chamber"> | Date | string
    updatedAt?: DateTimeFilter<"Chamber"> | Date | string
  }

  export type TemperatureRecordUpsertWithWhereUniqueWithoutClientProfileInput = {
    where: TemperatureRecordWhereUniqueInput
    update: XOR<TemperatureRecordUpdateWithoutClientProfileInput, TemperatureRecordUncheckedUpdateWithoutClientProfileInput>
    create: XOR<TemperatureRecordCreateWithoutClientProfileInput, TemperatureRecordUncheckedCreateWithoutClientProfileInput>
  }

  export type TemperatureRecordUpdateWithWhereUniqueWithoutClientProfileInput = {
    where: TemperatureRecordWhereUniqueInput
    data: XOR<TemperatureRecordUpdateWithoutClientProfileInput, TemperatureRecordUncheckedUpdateWithoutClientProfileInput>
  }

  export type TemperatureRecordUpdateManyWithWhereWithoutClientProfileInput = {
    where: TemperatureRecordScalarWhereInput
    data: XOR<TemperatureRecordUpdateManyMutationInput, TemperatureRecordUncheckedUpdateManyWithoutClientProfileInput>
  }

  export type TemperatureRecordScalarWhereInput = {
    AND?: TemperatureRecordScalarWhereInput | TemperatureRecordScalarWhereInput[]
    OR?: TemperatureRecordScalarWhereInput[]
    NOT?: TemperatureRecordScalarWhereInput | TemperatureRecordScalarWhereInput[]
    id?: IntFilter<"TemperatureRecord"> | number
    date?: DateTimeFilter<"TemperatureRecord"> | Date | string
    clientProfileId?: IntFilter<"TemperatureRecord"> | number
    createdAt?: DateTimeFilter<"TemperatureRecord"> | Date | string
    updatedAt?: DateTimeFilter<"TemperatureRecord"> | Date | string
  }

  export type GoodsReceiptUpsertWithWhereUniqueWithoutClientProfileInput = {
    where: GoodsReceiptWhereUniqueInput
    update: XOR<GoodsReceiptUpdateWithoutClientProfileInput, GoodsReceiptUncheckedUpdateWithoutClientProfileInput>
    create: XOR<GoodsReceiptCreateWithoutClientProfileInput, GoodsReceiptUncheckedCreateWithoutClientProfileInput>
  }

  export type GoodsReceiptUpdateWithWhereUniqueWithoutClientProfileInput = {
    where: GoodsReceiptWhereUniqueInput
    data: XOR<GoodsReceiptUpdateWithoutClientProfileInput, GoodsReceiptUncheckedUpdateWithoutClientProfileInput>
  }

  export type GoodsReceiptUpdateManyWithWhereWithoutClientProfileInput = {
    where: GoodsReceiptScalarWhereInput
    data: XOR<GoodsReceiptUpdateManyMutationInput, GoodsReceiptUncheckedUpdateManyWithoutClientProfileInput>
  }

  export type GoodsReceiptScalarWhereInput = {
    AND?: GoodsReceiptScalarWhereInput | GoodsReceiptScalarWhereInput[]
    OR?: GoodsReceiptScalarWhereInput[]
    NOT?: GoodsReceiptScalarWhereInput | GoodsReceiptScalarWhereInput[]
    id?: IntFilter<"GoodsReceipt"> | number
    providerName?: StringNullableFilter<"GoodsReceipt"> | string | null
    productName?: StringFilter<"GoodsReceipt"> | string
    lote?: StringNullableFilter<"GoodsReceipt"> | string | null
    invoiceNumber?: StringNullableFilter<"GoodsReceipt"> | string | null
    quantity?: StringNullableFilter<"GoodsReceipt"> | string | null
    date?: DateTimeFilter<"GoodsReceipt"> | Date | string
    deliveryNoteImage?: StringNullableFilter<"GoodsReceipt"> | string | null
    clientProfileId?: IntFilter<"GoodsReceipt"> | number
    createdAt?: DateTimeFilter<"GoodsReceipt"> | Date | string
    updatedAt?: DateTimeFilter<"GoodsReceipt"> | Date | string
  }

  export type ClientProfileCreateWithoutRecipesInput = {
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutClientProfileInput
    cleaningZones?: CleaningZoneCreateNestedManyWithoutClientProfileInput
    cleaningLogs?: CleaningLogCreateNestedManyWithoutClientProfileInput
    chambers?: ChamberCreateNestedManyWithoutClientProfileInput
    temperatureRecords?: TemperatureRecordCreateNestedManyWithoutClientProfileInput
    goodsReceipts?: GoodsReceiptCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileUncheckedCreateWithoutRecipesInput = {
    id?: number
    userId: number
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    cleaningZones?: CleaningZoneUncheckedCreateNestedManyWithoutClientProfileInput
    cleaningLogs?: CleaningLogUncheckedCreateNestedManyWithoutClientProfileInput
    chambers?: ChamberUncheckedCreateNestedManyWithoutClientProfileInput
    temperatureRecords?: TemperatureRecordUncheckedCreateNestedManyWithoutClientProfileInput
    goodsReceipts?: GoodsReceiptUncheckedCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileCreateOrConnectWithoutRecipesInput = {
    where: ClientProfileWhereUniqueInput
    create: XOR<ClientProfileCreateWithoutRecipesInput, ClientProfileUncheckedCreateWithoutRecipesInput>
  }

  export type IngredientCreateWithoutRecipeInput = {
    name: string
    amount: string
    unit: string
    loteMandatory?: boolean
    quantityMandatory?: boolean
    createdAt?: Date | string
  }

  export type IngredientUncheckedCreateWithoutRecipeInput = {
    id?: number
    name: string
    amount: string
    unit: string
    loteMandatory?: boolean
    quantityMandatory?: boolean
    createdAt?: Date | string
  }

  export type IngredientCreateOrConnectWithoutRecipeInput = {
    where: IngredientWhereUniqueInput
    create: XOR<IngredientCreateWithoutRecipeInput, IngredientUncheckedCreateWithoutRecipeInput>
  }

  export type IngredientCreateManyRecipeInputEnvelope = {
    data: IngredientCreateManyRecipeInput | IngredientCreateManyRecipeInput[]
  }

  export type ElaborationCreateWithoutRecipeInput = {
    name: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    ingredients?: ElaborationIngredientCreateNestedManyWithoutElaborationInput
  }

  export type ElaborationUncheckedCreateWithoutRecipeInput = {
    id?: number
    name: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    ingredients?: ElaborationIngredientUncheckedCreateNestedManyWithoutElaborationInput
  }

  export type ElaborationCreateOrConnectWithoutRecipeInput = {
    where: ElaborationWhereUniqueInput
    create: XOR<ElaborationCreateWithoutRecipeInput, ElaborationUncheckedCreateWithoutRecipeInput>
  }

  export type ElaborationCreateManyRecipeInputEnvelope = {
    data: ElaborationCreateManyRecipeInput | ElaborationCreateManyRecipeInput[]
  }

  export type ClientProfileUpsertWithoutRecipesInput = {
    update: XOR<ClientProfileUpdateWithoutRecipesInput, ClientProfileUncheckedUpdateWithoutRecipesInput>
    create: XOR<ClientProfileCreateWithoutRecipesInput, ClientProfileUncheckedCreateWithoutRecipesInput>
    where?: ClientProfileWhereInput
  }

  export type ClientProfileUpdateToOneWithWhereWithoutRecipesInput = {
    where?: ClientProfileWhereInput
    data: XOR<ClientProfileUpdateWithoutRecipesInput, ClientProfileUncheckedUpdateWithoutRecipesInput>
  }

  export type ClientProfileUpdateWithoutRecipesInput = {
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutClientProfileNestedInput
    cleaningZones?: CleaningZoneUpdateManyWithoutClientProfileNestedInput
    cleaningLogs?: CleaningLogUpdateManyWithoutClientProfileNestedInput
    chambers?: ChamberUpdateManyWithoutClientProfileNestedInput
    temperatureRecords?: TemperatureRecordUpdateManyWithoutClientProfileNestedInput
    goodsReceipts?: GoodsReceiptUpdateManyWithoutClientProfileNestedInput
  }

  export type ClientProfileUncheckedUpdateWithoutRecipesInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cleaningZones?: CleaningZoneUncheckedUpdateManyWithoutClientProfileNestedInput
    cleaningLogs?: CleaningLogUncheckedUpdateManyWithoutClientProfileNestedInput
    chambers?: ChamberUncheckedUpdateManyWithoutClientProfileNestedInput
    temperatureRecords?: TemperatureRecordUncheckedUpdateManyWithoutClientProfileNestedInput
    goodsReceipts?: GoodsReceiptUncheckedUpdateManyWithoutClientProfileNestedInput
  }

  export type IngredientUpsertWithWhereUniqueWithoutRecipeInput = {
    where: IngredientWhereUniqueInput
    update: XOR<IngredientUpdateWithoutRecipeInput, IngredientUncheckedUpdateWithoutRecipeInput>
    create: XOR<IngredientCreateWithoutRecipeInput, IngredientUncheckedCreateWithoutRecipeInput>
  }

  export type IngredientUpdateWithWhereUniqueWithoutRecipeInput = {
    where: IngredientWhereUniqueInput
    data: XOR<IngredientUpdateWithoutRecipeInput, IngredientUncheckedUpdateWithoutRecipeInput>
  }

  export type IngredientUpdateManyWithWhereWithoutRecipeInput = {
    where: IngredientScalarWhereInput
    data: XOR<IngredientUpdateManyMutationInput, IngredientUncheckedUpdateManyWithoutRecipeInput>
  }

  export type IngredientScalarWhereInput = {
    AND?: IngredientScalarWhereInput | IngredientScalarWhereInput[]
    OR?: IngredientScalarWhereInput[]
    NOT?: IngredientScalarWhereInput | IngredientScalarWhereInput[]
    id?: IntFilter<"Ingredient"> | number
    recipeId?: IntFilter<"Ingredient"> | number
    name?: StringFilter<"Ingredient"> | string
    amount?: StringFilter<"Ingredient"> | string
    unit?: StringFilter<"Ingredient"> | string
    loteMandatory?: BoolFilter<"Ingredient"> | boolean
    quantityMandatory?: BoolFilter<"Ingredient"> | boolean
    createdAt?: DateTimeFilter<"Ingredient"> | Date | string
  }

  export type ElaborationUpsertWithWhereUniqueWithoutRecipeInput = {
    where: ElaborationWhereUniqueInput
    update: XOR<ElaborationUpdateWithoutRecipeInput, ElaborationUncheckedUpdateWithoutRecipeInput>
    create: XOR<ElaborationCreateWithoutRecipeInput, ElaborationUncheckedCreateWithoutRecipeInput>
  }

  export type ElaborationUpdateWithWhereUniqueWithoutRecipeInput = {
    where: ElaborationWhereUniqueInput
    data: XOR<ElaborationUpdateWithoutRecipeInput, ElaborationUncheckedUpdateWithoutRecipeInput>
  }

  export type ElaborationUpdateManyWithWhereWithoutRecipeInput = {
    where: ElaborationScalarWhereInput
    data: XOR<ElaborationUpdateManyMutationInput, ElaborationUncheckedUpdateManyWithoutRecipeInput>
  }

  export type ElaborationScalarWhereInput = {
    AND?: ElaborationScalarWhereInput | ElaborationScalarWhereInput[]
    OR?: ElaborationScalarWhereInput[]
    NOT?: ElaborationScalarWhereInput | ElaborationScalarWhereInput[]
    id?: IntFilter<"Elaboration"> | number
    name?: StringFilter<"Elaboration"> | string
    date?: DateTimeFilter<"Elaboration"> | Date | string
    recipeId?: IntFilter<"Elaboration"> | number
    createdAt?: DateTimeFilter<"Elaboration"> | Date | string
    updatedAt?: DateTimeFilter<"Elaboration"> | Date | string
  }

  export type RecipeCreateWithoutIngredientsInput = {
    name: string
    lotesMandatory?: boolean
    quantitiesMandatory?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    clientProfile: ClientProfileCreateNestedOneWithoutRecipesInput
    elaborations?: ElaborationCreateNestedManyWithoutRecipeInput
  }

  export type RecipeUncheckedCreateWithoutIngredientsInput = {
    id?: number
    name: string
    clientProfileId: number
    lotesMandatory?: boolean
    quantitiesMandatory?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    elaborations?: ElaborationUncheckedCreateNestedManyWithoutRecipeInput
  }

  export type RecipeCreateOrConnectWithoutIngredientsInput = {
    where: RecipeWhereUniqueInput
    create: XOR<RecipeCreateWithoutIngredientsInput, RecipeUncheckedCreateWithoutIngredientsInput>
  }

  export type RecipeUpsertWithoutIngredientsInput = {
    update: XOR<RecipeUpdateWithoutIngredientsInput, RecipeUncheckedUpdateWithoutIngredientsInput>
    create: XOR<RecipeCreateWithoutIngredientsInput, RecipeUncheckedCreateWithoutIngredientsInput>
    where?: RecipeWhereInput
  }

  export type RecipeUpdateToOneWithWhereWithoutIngredientsInput = {
    where?: RecipeWhereInput
    data: XOR<RecipeUpdateWithoutIngredientsInput, RecipeUncheckedUpdateWithoutIngredientsInput>
  }

  export type RecipeUpdateWithoutIngredientsInput = {
    name?: StringFieldUpdateOperationsInput | string
    lotesMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantitiesMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfile?: ClientProfileUpdateOneRequiredWithoutRecipesNestedInput
    elaborations?: ElaborationUpdateManyWithoutRecipeNestedInput
  }

  export type RecipeUncheckedUpdateWithoutIngredientsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    lotesMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantitiesMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    elaborations?: ElaborationUncheckedUpdateManyWithoutRecipeNestedInput
  }

  export type RecipeCreateWithoutElaborationsInput = {
    name: string
    lotesMandatory?: boolean
    quantitiesMandatory?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    clientProfile: ClientProfileCreateNestedOneWithoutRecipesInput
    ingredients?: IngredientCreateNestedManyWithoutRecipeInput
  }

  export type RecipeUncheckedCreateWithoutElaborationsInput = {
    id?: number
    name: string
    clientProfileId: number
    lotesMandatory?: boolean
    quantitiesMandatory?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    ingredients?: IngredientUncheckedCreateNestedManyWithoutRecipeInput
  }

  export type RecipeCreateOrConnectWithoutElaborationsInput = {
    where: RecipeWhereUniqueInput
    create: XOR<RecipeCreateWithoutElaborationsInput, RecipeUncheckedCreateWithoutElaborationsInput>
  }

  export type ElaborationIngredientCreateWithoutElaborationInput = {
    name: string
    lote?: string | null
    realAmount: string
    unit: string
    createdAt?: Date | string
  }

  export type ElaborationIngredientUncheckedCreateWithoutElaborationInput = {
    id?: number
    name: string
    lote?: string | null
    realAmount: string
    unit: string
    createdAt?: Date | string
  }

  export type ElaborationIngredientCreateOrConnectWithoutElaborationInput = {
    where: ElaborationIngredientWhereUniqueInput
    create: XOR<ElaborationIngredientCreateWithoutElaborationInput, ElaborationIngredientUncheckedCreateWithoutElaborationInput>
  }

  export type ElaborationIngredientCreateManyElaborationInputEnvelope = {
    data: ElaborationIngredientCreateManyElaborationInput | ElaborationIngredientCreateManyElaborationInput[]
  }

  export type RecipeUpsertWithoutElaborationsInput = {
    update: XOR<RecipeUpdateWithoutElaborationsInput, RecipeUncheckedUpdateWithoutElaborationsInput>
    create: XOR<RecipeCreateWithoutElaborationsInput, RecipeUncheckedCreateWithoutElaborationsInput>
    where?: RecipeWhereInput
  }

  export type RecipeUpdateToOneWithWhereWithoutElaborationsInput = {
    where?: RecipeWhereInput
    data: XOR<RecipeUpdateWithoutElaborationsInput, RecipeUncheckedUpdateWithoutElaborationsInput>
  }

  export type RecipeUpdateWithoutElaborationsInput = {
    name?: StringFieldUpdateOperationsInput | string
    lotesMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantitiesMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfile?: ClientProfileUpdateOneRequiredWithoutRecipesNestedInput
    ingredients?: IngredientUpdateManyWithoutRecipeNestedInput
  }

  export type RecipeUncheckedUpdateWithoutElaborationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    lotesMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantitiesMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ingredients?: IngredientUncheckedUpdateManyWithoutRecipeNestedInput
  }

  export type ElaborationIngredientUpsertWithWhereUniqueWithoutElaborationInput = {
    where: ElaborationIngredientWhereUniqueInput
    update: XOR<ElaborationIngredientUpdateWithoutElaborationInput, ElaborationIngredientUncheckedUpdateWithoutElaborationInput>
    create: XOR<ElaborationIngredientCreateWithoutElaborationInput, ElaborationIngredientUncheckedCreateWithoutElaborationInput>
  }

  export type ElaborationIngredientUpdateWithWhereUniqueWithoutElaborationInput = {
    where: ElaborationIngredientWhereUniqueInput
    data: XOR<ElaborationIngredientUpdateWithoutElaborationInput, ElaborationIngredientUncheckedUpdateWithoutElaborationInput>
  }

  export type ElaborationIngredientUpdateManyWithWhereWithoutElaborationInput = {
    where: ElaborationIngredientScalarWhereInput
    data: XOR<ElaborationIngredientUpdateManyMutationInput, ElaborationIngredientUncheckedUpdateManyWithoutElaborationInput>
  }

  export type ElaborationIngredientScalarWhereInput = {
    AND?: ElaborationIngredientScalarWhereInput | ElaborationIngredientScalarWhereInput[]
    OR?: ElaborationIngredientScalarWhereInput[]
    NOT?: ElaborationIngredientScalarWhereInput | ElaborationIngredientScalarWhereInput[]
    id?: IntFilter<"ElaborationIngredient"> | number
    elaborationId?: IntFilter<"ElaborationIngredient"> | number
    name?: StringFilter<"ElaborationIngredient"> | string
    lote?: StringNullableFilter<"ElaborationIngredient"> | string | null
    realAmount?: StringFilter<"ElaborationIngredient"> | string
    unit?: StringFilter<"ElaborationIngredient"> | string
    createdAt?: DateTimeFilter<"ElaborationIngredient"> | Date | string
  }

  export type ElaborationCreateWithoutIngredientsInput = {
    name: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    recipe: RecipeCreateNestedOneWithoutElaborationsInput
  }

  export type ElaborationUncheckedCreateWithoutIngredientsInput = {
    id?: number
    name: string
    date?: Date | string
    recipeId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ElaborationCreateOrConnectWithoutIngredientsInput = {
    where: ElaborationWhereUniqueInput
    create: XOR<ElaborationCreateWithoutIngredientsInput, ElaborationUncheckedCreateWithoutIngredientsInput>
  }

  export type ElaborationUpsertWithoutIngredientsInput = {
    update: XOR<ElaborationUpdateWithoutIngredientsInput, ElaborationUncheckedUpdateWithoutIngredientsInput>
    create: XOR<ElaborationCreateWithoutIngredientsInput, ElaborationUncheckedCreateWithoutIngredientsInput>
    where?: ElaborationWhereInput
  }

  export type ElaborationUpdateToOneWithWhereWithoutIngredientsInput = {
    where?: ElaborationWhereInput
    data: XOR<ElaborationUpdateWithoutIngredientsInput, ElaborationUncheckedUpdateWithoutIngredientsInput>
  }

  export type ElaborationUpdateWithoutIngredientsInput = {
    name?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipe?: RecipeUpdateOneRequiredWithoutElaborationsNestedInput
  }

  export type ElaborationUncheckedUpdateWithoutIngredientsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    recipeId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientProfileCreateWithoutCleaningZonesInput = {
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutClientProfileInput
    recipes?: RecipeCreateNestedManyWithoutClientProfileInput
    cleaningLogs?: CleaningLogCreateNestedManyWithoutClientProfileInput
    chambers?: ChamberCreateNestedManyWithoutClientProfileInput
    temperatureRecords?: TemperatureRecordCreateNestedManyWithoutClientProfileInput
    goodsReceipts?: GoodsReceiptCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileUncheckedCreateWithoutCleaningZonesInput = {
    id?: number
    userId: number
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    recipes?: RecipeUncheckedCreateNestedManyWithoutClientProfileInput
    cleaningLogs?: CleaningLogUncheckedCreateNestedManyWithoutClientProfileInput
    chambers?: ChamberUncheckedCreateNestedManyWithoutClientProfileInput
    temperatureRecords?: TemperatureRecordUncheckedCreateNestedManyWithoutClientProfileInput
    goodsReceipts?: GoodsReceiptUncheckedCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileCreateOrConnectWithoutCleaningZonesInput = {
    where: ClientProfileWhereUniqueInput
    create: XOR<ClientProfileCreateWithoutCleaningZonesInput, ClientProfileUncheckedCreateWithoutCleaningZonesInput>
  }

  export type CleaningLogZoneCreateWithoutCleaningZoneInput = {
    cleaningLog: CleaningLogCreateNestedOneWithoutZonesInput
  }

  export type CleaningLogZoneUncheckedCreateWithoutCleaningZoneInput = {
    cleaningLogId: number
  }

  export type CleaningLogZoneCreateOrConnectWithoutCleaningZoneInput = {
    where: CleaningLogZoneWhereUniqueInput
    create: XOR<CleaningLogZoneCreateWithoutCleaningZoneInput, CleaningLogZoneUncheckedCreateWithoutCleaningZoneInput>
  }

  export type CleaningLogZoneCreateManyCleaningZoneInputEnvelope = {
    data: CleaningLogZoneCreateManyCleaningZoneInput | CleaningLogZoneCreateManyCleaningZoneInput[]
  }

  export type ClientProfileUpsertWithoutCleaningZonesInput = {
    update: XOR<ClientProfileUpdateWithoutCleaningZonesInput, ClientProfileUncheckedUpdateWithoutCleaningZonesInput>
    create: XOR<ClientProfileCreateWithoutCleaningZonesInput, ClientProfileUncheckedCreateWithoutCleaningZonesInput>
    where?: ClientProfileWhereInput
  }

  export type ClientProfileUpdateToOneWithWhereWithoutCleaningZonesInput = {
    where?: ClientProfileWhereInput
    data: XOR<ClientProfileUpdateWithoutCleaningZonesInput, ClientProfileUncheckedUpdateWithoutCleaningZonesInput>
  }

  export type ClientProfileUpdateWithoutCleaningZonesInput = {
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutClientProfileNestedInput
    recipes?: RecipeUpdateManyWithoutClientProfileNestedInput
    cleaningLogs?: CleaningLogUpdateManyWithoutClientProfileNestedInput
    chambers?: ChamberUpdateManyWithoutClientProfileNestedInput
    temperatureRecords?: TemperatureRecordUpdateManyWithoutClientProfileNestedInput
    goodsReceipts?: GoodsReceiptUpdateManyWithoutClientProfileNestedInput
  }

  export type ClientProfileUncheckedUpdateWithoutCleaningZonesInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipes?: RecipeUncheckedUpdateManyWithoutClientProfileNestedInput
    cleaningLogs?: CleaningLogUncheckedUpdateManyWithoutClientProfileNestedInput
    chambers?: ChamberUncheckedUpdateManyWithoutClientProfileNestedInput
    temperatureRecords?: TemperatureRecordUncheckedUpdateManyWithoutClientProfileNestedInput
    goodsReceipts?: GoodsReceiptUncheckedUpdateManyWithoutClientProfileNestedInput
  }

  export type CleaningLogZoneUpsertWithWhereUniqueWithoutCleaningZoneInput = {
    where: CleaningLogZoneWhereUniqueInput
    update: XOR<CleaningLogZoneUpdateWithoutCleaningZoneInput, CleaningLogZoneUncheckedUpdateWithoutCleaningZoneInput>
    create: XOR<CleaningLogZoneCreateWithoutCleaningZoneInput, CleaningLogZoneUncheckedCreateWithoutCleaningZoneInput>
  }

  export type CleaningLogZoneUpdateWithWhereUniqueWithoutCleaningZoneInput = {
    where: CleaningLogZoneWhereUniqueInput
    data: XOR<CleaningLogZoneUpdateWithoutCleaningZoneInput, CleaningLogZoneUncheckedUpdateWithoutCleaningZoneInput>
  }

  export type CleaningLogZoneUpdateManyWithWhereWithoutCleaningZoneInput = {
    where: CleaningLogZoneScalarWhereInput
    data: XOR<CleaningLogZoneUpdateManyMutationInput, CleaningLogZoneUncheckedUpdateManyWithoutCleaningZoneInput>
  }

  export type CleaningLogZoneScalarWhereInput = {
    AND?: CleaningLogZoneScalarWhereInput | CleaningLogZoneScalarWhereInput[]
    OR?: CleaningLogZoneScalarWhereInput[]
    NOT?: CleaningLogZoneScalarWhereInput | CleaningLogZoneScalarWhereInput[]
    cleaningLogId?: IntFilter<"CleaningLogZone"> | number
    cleaningZoneId?: IntFilter<"CleaningLogZone"> | number
  }

  export type ClientProfileCreateWithoutCleaningLogsInput = {
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutClientProfileInput
    recipes?: RecipeCreateNestedManyWithoutClientProfileInput
    cleaningZones?: CleaningZoneCreateNestedManyWithoutClientProfileInput
    chambers?: ChamberCreateNestedManyWithoutClientProfileInput
    temperatureRecords?: TemperatureRecordCreateNestedManyWithoutClientProfileInput
    goodsReceipts?: GoodsReceiptCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileUncheckedCreateWithoutCleaningLogsInput = {
    id?: number
    userId: number
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    recipes?: RecipeUncheckedCreateNestedManyWithoutClientProfileInput
    cleaningZones?: CleaningZoneUncheckedCreateNestedManyWithoutClientProfileInput
    chambers?: ChamberUncheckedCreateNestedManyWithoutClientProfileInput
    temperatureRecords?: TemperatureRecordUncheckedCreateNestedManyWithoutClientProfileInput
    goodsReceipts?: GoodsReceiptUncheckedCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileCreateOrConnectWithoutCleaningLogsInput = {
    where: ClientProfileWhereUniqueInput
    create: XOR<ClientProfileCreateWithoutCleaningLogsInput, ClientProfileUncheckedCreateWithoutCleaningLogsInput>
  }

  export type CleaningLogZoneCreateWithoutCleaningLogInput = {
    cleaningZone: CleaningZoneCreateNestedOneWithoutLogsInput
  }

  export type CleaningLogZoneUncheckedCreateWithoutCleaningLogInput = {
    cleaningZoneId: number
  }

  export type CleaningLogZoneCreateOrConnectWithoutCleaningLogInput = {
    where: CleaningLogZoneWhereUniqueInput
    create: XOR<CleaningLogZoneCreateWithoutCleaningLogInput, CleaningLogZoneUncheckedCreateWithoutCleaningLogInput>
  }

  export type CleaningLogZoneCreateManyCleaningLogInputEnvelope = {
    data: CleaningLogZoneCreateManyCleaningLogInput | CleaningLogZoneCreateManyCleaningLogInput[]
  }

  export type ClientProfileUpsertWithoutCleaningLogsInput = {
    update: XOR<ClientProfileUpdateWithoutCleaningLogsInput, ClientProfileUncheckedUpdateWithoutCleaningLogsInput>
    create: XOR<ClientProfileCreateWithoutCleaningLogsInput, ClientProfileUncheckedCreateWithoutCleaningLogsInput>
    where?: ClientProfileWhereInput
  }

  export type ClientProfileUpdateToOneWithWhereWithoutCleaningLogsInput = {
    where?: ClientProfileWhereInput
    data: XOR<ClientProfileUpdateWithoutCleaningLogsInput, ClientProfileUncheckedUpdateWithoutCleaningLogsInput>
  }

  export type ClientProfileUpdateWithoutCleaningLogsInput = {
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutClientProfileNestedInput
    recipes?: RecipeUpdateManyWithoutClientProfileNestedInput
    cleaningZones?: CleaningZoneUpdateManyWithoutClientProfileNestedInput
    chambers?: ChamberUpdateManyWithoutClientProfileNestedInput
    temperatureRecords?: TemperatureRecordUpdateManyWithoutClientProfileNestedInput
    goodsReceipts?: GoodsReceiptUpdateManyWithoutClientProfileNestedInput
  }

  export type ClientProfileUncheckedUpdateWithoutCleaningLogsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipes?: RecipeUncheckedUpdateManyWithoutClientProfileNestedInput
    cleaningZones?: CleaningZoneUncheckedUpdateManyWithoutClientProfileNestedInput
    chambers?: ChamberUncheckedUpdateManyWithoutClientProfileNestedInput
    temperatureRecords?: TemperatureRecordUncheckedUpdateManyWithoutClientProfileNestedInput
    goodsReceipts?: GoodsReceiptUncheckedUpdateManyWithoutClientProfileNestedInput
  }

  export type CleaningLogZoneUpsertWithWhereUniqueWithoutCleaningLogInput = {
    where: CleaningLogZoneWhereUniqueInput
    update: XOR<CleaningLogZoneUpdateWithoutCleaningLogInput, CleaningLogZoneUncheckedUpdateWithoutCleaningLogInput>
    create: XOR<CleaningLogZoneCreateWithoutCleaningLogInput, CleaningLogZoneUncheckedCreateWithoutCleaningLogInput>
  }

  export type CleaningLogZoneUpdateWithWhereUniqueWithoutCleaningLogInput = {
    where: CleaningLogZoneWhereUniqueInput
    data: XOR<CleaningLogZoneUpdateWithoutCleaningLogInput, CleaningLogZoneUncheckedUpdateWithoutCleaningLogInput>
  }

  export type CleaningLogZoneUpdateManyWithWhereWithoutCleaningLogInput = {
    where: CleaningLogZoneScalarWhereInput
    data: XOR<CleaningLogZoneUpdateManyMutationInput, CleaningLogZoneUncheckedUpdateManyWithoutCleaningLogInput>
  }

  export type CleaningLogCreateWithoutZonesInput = {
    personName: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    clientProfile: ClientProfileCreateNestedOneWithoutCleaningLogsInput
  }

  export type CleaningLogUncheckedCreateWithoutZonesInput = {
    id?: number
    personName: string
    date?: Date | string
    clientProfileId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CleaningLogCreateOrConnectWithoutZonesInput = {
    where: CleaningLogWhereUniqueInput
    create: XOR<CleaningLogCreateWithoutZonesInput, CleaningLogUncheckedCreateWithoutZonesInput>
  }

  export type CleaningZoneCreateWithoutLogsInput = {
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    clientProfile: ClientProfileCreateNestedOneWithoutCleaningZonesInput
  }

  export type CleaningZoneUncheckedCreateWithoutLogsInput = {
    id?: number
    name: string
    clientProfileId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CleaningZoneCreateOrConnectWithoutLogsInput = {
    where: CleaningZoneWhereUniqueInput
    create: XOR<CleaningZoneCreateWithoutLogsInput, CleaningZoneUncheckedCreateWithoutLogsInput>
  }

  export type CleaningLogUpsertWithoutZonesInput = {
    update: XOR<CleaningLogUpdateWithoutZonesInput, CleaningLogUncheckedUpdateWithoutZonesInput>
    create: XOR<CleaningLogCreateWithoutZonesInput, CleaningLogUncheckedCreateWithoutZonesInput>
    where?: CleaningLogWhereInput
  }

  export type CleaningLogUpdateToOneWithWhereWithoutZonesInput = {
    where?: CleaningLogWhereInput
    data: XOR<CleaningLogUpdateWithoutZonesInput, CleaningLogUncheckedUpdateWithoutZonesInput>
  }

  export type CleaningLogUpdateWithoutZonesInput = {
    personName?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfile?: ClientProfileUpdateOneRequiredWithoutCleaningLogsNestedInput
  }

  export type CleaningLogUncheckedUpdateWithoutZonesInput = {
    id?: IntFieldUpdateOperationsInput | number
    personName?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CleaningZoneUpsertWithoutLogsInput = {
    update: XOR<CleaningZoneUpdateWithoutLogsInput, CleaningZoneUncheckedUpdateWithoutLogsInput>
    create: XOR<CleaningZoneCreateWithoutLogsInput, CleaningZoneUncheckedCreateWithoutLogsInput>
    where?: CleaningZoneWhereInput
  }

  export type CleaningZoneUpdateToOneWithWhereWithoutLogsInput = {
    where?: CleaningZoneWhereInput
    data: XOR<CleaningZoneUpdateWithoutLogsInput, CleaningZoneUncheckedUpdateWithoutLogsInput>
  }

  export type CleaningZoneUpdateWithoutLogsInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfile?: ClientProfileUpdateOneRequiredWithoutCleaningZonesNestedInput
  }

  export type CleaningZoneUncheckedUpdateWithoutLogsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientProfileCreateWithoutChambersInput = {
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutClientProfileInput
    recipes?: RecipeCreateNestedManyWithoutClientProfileInput
    cleaningZones?: CleaningZoneCreateNestedManyWithoutClientProfileInput
    cleaningLogs?: CleaningLogCreateNestedManyWithoutClientProfileInput
    temperatureRecords?: TemperatureRecordCreateNestedManyWithoutClientProfileInput
    goodsReceipts?: GoodsReceiptCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileUncheckedCreateWithoutChambersInput = {
    id?: number
    userId: number
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    recipes?: RecipeUncheckedCreateNestedManyWithoutClientProfileInput
    cleaningZones?: CleaningZoneUncheckedCreateNestedManyWithoutClientProfileInput
    cleaningLogs?: CleaningLogUncheckedCreateNestedManyWithoutClientProfileInput
    temperatureRecords?: TemperatureRecordUncheckedCreateNestedManyWithoutClientProfileInput
    goodsReceipts?: GoodsReceiptUncheckedCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileCreateOrConnectWithoutChambersInput = {
    where: ClientProfileWhereUniqueInput
    create: XOR<ClientProfileCreateWithoutChambersInput, ClientProfileUncheckedCreateWithoutChambersInput>
  }

  export type TemperatureValueCreateWithoutChamberInput = {
    value: number
    record: TemperatureRecordCreateNestedOneWithoutValuesInput
  }

  export type TemperatureValueUncheckedCreateWithoutChamberInput = {
    id?: number
    value: number
    temperatureRecordId: number
  }

  export type TemperatureValueCreateOrConnectWithoutChamberInput = {
    where: TemperatureValueWhereUniqueInput
    create: XOR<TemperatureValueCreateWithoutChamberInput, TemperatureValueUncheckedCreateWithoutChamberInput>
  }

  export type TemperatureValueCreateManyChamberInputEnvelope = {
    data: TemperatureValueCreateManyChamberInput | TemperatureValueCreateManyChamberInput[]
  }

  export type ClientProfileUpsertWithoutChambersInput = {
    update: XOR<ClientProfileUpdateWithoutChambersInput, ClientProfileUncheckedUpdateWithoutChambersInput>
    create: XOR<ClientProfileCreateWithoutChambersInput, ClientProfileUncheckedCreateWithoutChambersInput>
    where?: ClientProfileWhereInput
  }

  export type ClientProfileUpdateToOneWithWhereWithoutChambersInput = {
    where?: ClientProfileWhereInput
    data: XOR<ClientProfileUpdateWithoutChambersInput, ClientProfileUncheckedUpdateWithoutChambersInput>
  }

  export type ClientProfileUpdateWithoutChambersInput = {
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutClientProfileNestedInput
    recipes?: RecipeUpdateManyWithoutClientProfileNestedInput
    cleaningZones?: CleaningZoneUpdateManyWithoutClientProfileNestedInput
    cleaningLogs?: CleaningLogUpdateManyWithoutClientProfileNestedInput
    temperatureRecords?: TemperatureRecordUpdateManyWithoutClientProfileNestedInput
    goodsReceipts?: GoodsReceiptUpdateManyWithoutClientProfileNestedInput
  }

  export type ClientProfileUncheckedUpdateWithoutChambersInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipes?: RecipeUncheckedUpdateManyWithoutClientProfileNestedInput
    cleaningZones?: CleaningZoneUncheckedUpdateManyWithoutClientProfileNestedInput
    cleaningLogs?: CleaningLogUncheckedUpdateManyWithoutClientProfileNestedInput
    temperatureRecords?: TemperatureRecordUncheckedUpdateManyWithoutClientProfileNestedInput
    goodsReceipts?: GoodsReceiptUncheckedUpdateManyWithoutClientProfileNestedInput
  }

  export type TemperatureValueUpsertWithWhereUniqueWithoutChamberInput = {
    where: TemperatureValueWhereUniqueInput
    update: XOR<TemperatureValueUpdateWithoutChamberInput, TemperatureValueUncheckedUpdateWithoutChamberInput>
    create: XOR<TemperatureValueCreateWithoutChamberInput, TemperatureValueUncheckedCreateWithoutChamberInput>
  }

  export type TemperatureValueUpdateWithWhereUniqueWithoutChamberInput = {
    where: TemperatureValueWhereUniqueInput
    data: XOR<TemperatureValueUpdateWithoutChamberInput, TemperatureValueUncheckedUpdateWithoutChamberInput>
  }

  export type TemperatureValueUpdateManyWithWhereWithoutChamberInput = {
    where: TemperatureValueScalarWhereInput
    data: XOR<TemperatureValueUpdateManyMutationInput, TemperatureValueUncheckedUpdateManyWithoutChamberInput>
  }

  export type TemperatureValueScalarWhereInput = {
    AND?: TemperatureValueScalarWhereInput | TemperatureValueScalarWhereInput[]
    OR?: TemperatureValueScalarWhereInput[]
    NOT?: TemperatureValueScalarWhereInput | TemperatureValueScalarWhereInput[]
    id?: IntFilter<"TemperatureValue"> | number
    value?: FloatFilter<"TemperatureValue"> | number
    chamberId?: IntFilter<"TemperatureValue"> | number
    temperatureRecordId?: IntFilter<"TemperatureValue"> | number
  }

  export type ClientProfileCreateWithoutTemperatureRecordsInput = {
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutClientProfileInput
    recipes?: RecipeCreateNestedManyWithoutClientProfileInput
    cleaningZones?: CleaningZoneCreateNestedManyWithoutClientProfileInput
    cleaningLogs?: CleaningLogCreateNestedManyWithoutClientProfileInput
    chambers?: ChamberCreateNestedManyWithoutClientProfileInput
    goodsReceipts?: GoodsReceiptCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileUncheckedCreateWithoutTemperatureRecordsInput = {
    id?: number
    userId: number
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    recipes?: RecipeUncheckedCreateNestedManyWithoutClientProfileInput
    cleaningZones?: CleaningZoneUncheckedCreateNestedManyWithoutClientProfileInput
    cleaningLogs?: CleaningLogUncheckedCreateNestedManyWithoutClientProfileInput
    chambers?: ChamberUncheckedCreateNestedManyWithoutClientProfileInput
    goodsReceipts?: GoodsReceiptUncheckedCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileCreateOrConnectWithoutTemperatureRecordsInput = {
    where: ClientProfileWhereUniqueInput
    create: XOR<ClientProfileCreateWithoutTemperatureRecordsInput, ClientProfileUncheckedCreateWithoutTemperatureRecordsInput>
  }

  export type TemperatureValueCreateWithoutRecordInput = {
    value: number
    chamber: ChamberCreateNestedOneWithoutValuesInput
  }

  export type TemperatureValueUncheckedCreateWithoutRecordInput = {
    id?: number
    value: number
    chamberId: number
  }

  export type TemperatureValueCreateOrConnectWithoutRecordInput = {
    where: TemperatureValueWhereUniqueInput
    create: XOR<TemperatureValueCreateWithoutRecordInput, TemperatureValueUncheckedCreateWithoutRecordInput>
  }

  export type TemperatureValueCreateManyRecordInputEnvelope = {
    data: TemperatureValueCreateManyRecordInput | TemperatureValueCreateManyRecordInput[]
  }

  export type ClientProfileUpsertWithoutTemperatureRecordsInput = {
    update: XOR<ClientProfileUpdateWithoutTemperatureRecordsInput, ClientProfileUncheckedUpdateWithoutTemperatureRecordsInput>
    create: XOR<ClientProfileCreateWithoutTemperatureRecordsInput, ClientProfileUncheckedCreateWithoutTemperatureRecordsInput>
    where?: ClientProfileWhereInput
  }

  export type ClientProfileUpdateToOneWithWhereWithoutTemperatureRecordsInput = {
    where?: ClientProfileWhereInput
    data: XOR<ClientProfileUpdateWithoutTemperatureRecordsInput, ClientProfileUncheckedUpdateWithoutTemperatureRecordsInput>
  }

  export type ClientProfileUpdateWithoutTemperatureRecordsInput = {
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutClientProfileNestedInput
    recipes?: RecipeUpdateManyWithoutClientProfileNestedInput
    cleaningZones?: CleaningZoneUpdateManyWithoutClientProfileNestedInput
    cleaningLogs?: CleaningLogUpdateManyWithoutClientProfileNestedInput
    chambers?: ChamberUpdateManyWithoutClientProfileNestedInput
    goodsReceipts?: GoodsReceiptUpdateManyWithoutClientProfileNestedInput
  }

  export type ClientProfileUncheckedUpdateWithoutTemperatureRecordsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipes?: RecipeUncheckedUpdateManyWithoutClientProfileNestedInput
    cleaningZones?: CleaningZoneUncheckedUpdateManyWithoutClientProfileNestedInput
    cleaningLogs?: CleaningLogUncheckedUpdateManyWithoutClientProfileNestedInput
    chambers?: ChamberUncheckedUpdateManyWithoutClientProfileNestedInput
    goodsReceipts?: GoodsReceiptUncheckedUpdateManyWithoutClientProfileNestedInput
  }

  export type TemperatureValueUpsertWithWhereUniqueWithoutRecordInput = {
    where: TemperatureValueWhereUniqueInput
    update: XOR<TemperatureValueUpdateWithoutRecordInput, TemperatureValueUncheckedUpdateWithoutRecordInput>
    create: XOR<TemperatureValueCreateWithoutRecordInput, TemperatureValueUncheckedCreateWithoutRecordInput>
  }

  export type TemperatureValueUpdateWithWhereUniqueWithoutRecordInput = {
    where: TemperatureValueWhereUniqueInput
    data: XOR<TemperatureValueUpdateWithoutRecordInput, TemperatureValueUncheckedUpdateWithoutRecordInput>
  }

  export type TemperatureValueUpdateManyWithWhereWithoutRecordInput = {
    where: TemperatureValueScalarWhereInput
    data: XOR<TemperatureValueUpdateManyMutationInput, TemperatureValueUncheckedUpdateManyWithoutRecordInput>
  }

  export type ChamberCreateWithoutValuesInput = {
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    clientProfile: ClientProfileCreateNestedOneWithoutChambersInput
  }

  export type ChamberUncheckedCreateWithoutValuesInput = {
    id?: number
    name: string
    clientProfileId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChamberCreateOrConnectWithoutValuesInput = {
    where: ChamberWhereUniqueInput
    create: XOR<ChamberCreateWithoutValuesInput, ChamberUncheckedCreateWithoutValuesInput>
  }

  export type TemperatureRecordCreateWithoutValuesInput = {
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    clientProfile: ClientProfileCreateNestedOneWithoutTemperatureRecordsInput
  }

  export type TemperatureRecordUncheckedCreateWithoutValuesInput = {
    id?: number
    date?: Date | string
    clientProfileId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemperatureRecordCreateOrConnectWithoutValuesInput = {
    where: TemperatureRecordWhereUniqueInput
    create: XOR<TemperatureRecordCreateWithoutValuesInput, TemperatureRecordUncheckedCreateWithoutValuesInput>
  }

  export type ChamberUpsertWithoutValuesInput = {
    update: XOR<ChamberUpdateWithoutValuesInput, ChamberUncheckedUpdateWithoutValuesInput>
    create: XOR<ChamberCreateWithoutValuesInput, ChamberUncheckedCreateWithoutValuesInput>
    where?: ChamberWhereInput
  }

  export type ChamberUpdateToOneWithWhereWithoutValuesInput = {
    where?: ChamberWhereInput
    data: XOR<ChamberUpdateWithoutValuesInput, ChamberUncheckedUpdateWithoutValuesInput>
  }

  export type ChamberUpdateWithoutValuesInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfile?: ClientProfileUpdateOneRequiredWithoutChambersNestedInput
  }

  export type ChamberUncheckedUpdateWithoutValuesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemperatureRecordUpsertWithoutValuesInput = {
    update: XOR<TemperatureRecordUpdateWithoutValuesInput, TemperatureRecordUncheckedUpdateWithoutValuesInput>
    create: XOR<TemperatureRecordCreateWithoutValuesInput, TemperatureRecordUncheckedCreateWithoutValuesInput>
    where?: TemperatureRecordWhereInput
  }

  export type TemperatureRecordUpdateToOneWithWhereWithoutValuesInput = {
    where?: TemperatureRecordWhereInput
    data: XOR<TemperatureRecordUpdateWithoutValuesInput, TemperatureRecordUncheckedUpdateWithoutValuesInput>
  }

  export type TemperatureRecordUpdateWithoutValuesInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfile?: ClientProfileUpdateOneRequiredWithoutTemperatureRecordsNestedInput
  }

  export type TemperatureRecordUncheckedUpdateWithoutValuesInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    clientProfileId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientProfileCreateWithoutGoodsReceiptsInput = {
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutClientProfileInput
    recipes?: RecipeCreateNestedManyWithoutClientProfileInput
    cleaningZones?: CleaningZoneCreateNestedManyWithoutClientProfileInput
    cleaningLogs?: CleaningLogCreateNestedManyWithoutClientProfileInput
    chambers?: ChamberCreateNestedManyWithoutClientProfileInput
    temperatureRecords?: TemperatureRecordCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileUncheckedCreateWithoutGoodsReceiptsInput = {
    id?: number
    userId: number
    razonSocial: string
    nif: string
    phone?: string | null
    urlClientify?: string | null
    accountType?: string
    recetasContratadas?: number
    canManageRecipes?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    recipes?: RecipeUncheckedCreateNestedManyWithoutClientProfileInput
    cleaningZones?: CleaningZoneUncheckedCreateNestedManyWithoutClientProfileInput
    cleaningLogs?: CleaningLogUncheckedCreateNestedManyWithoutClientProfileInput
    chambers?: ChamberUncheckedCreateNestedManyWithoutClientProfileInput
    temperatureRecords?: TemperatureRecordUncheckedCreateNestedManyWithoutClientProfileInput
  }

  export type ClientProfileCreateOrConnectWithoutGoodsReceiptsInput = {
    where: ClientProfileWhereUniqueInput
    create: XOR<ClientProfileCreateWithoutGoodsReceiptsInput, ClientProfileUncheckedCreateWithoutGoodsReceiptsInput>
  }

  export type ClientProfileUpsertWithoutGoodsReceiptsInput = {
    update: XOR<ClientProfileUpdateWithoutGoodsReceiptsInput, ClientProfileUncheckedUpdateWithoutGoodsReceiptsInput>
    create: XOR<ClientProfileCreateWithoutGoodsReceiptsInput, ClientProfileUncheckedCreateWithoutGoodsReceiptsInput>
    where?: ClientProfileWhereInput
  }

  export type ClientProfileUpdateToOneWithWhereWithoutGoodsReceiptsInput = {
    where?: ClientProfileWhereInput
    data: XOR<ClientProfileUpdateWithoutGoodsReceiptsInput, ClientProfileUncheckedUpdateWithoutGoodsReceiptsInput>
  }

  export type ClientProfileUpdateWithoutGoodsReceiptsInput = {
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutClientProfileNestedInput
    recipes?: RecipeUpdateManyWithoutClientProfileNestedInput
    cleaningZones?: CleaningZoneUpdateManyWithoutClientProfileNestedInput
    cleaningLogs?: CleaningLogUpdateManyWithoutClientProfileNestedInput
    chambers?: ChamberUpdateManyWithoutClientProfileNestedInput
    temperatureRecords?: TemperatureRecordUpdateManyWithoutClientProfileNestedInput
  }

  export type ClientProfileUncheckedUpdateWithoutGoodsReceiptsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    razonSocial?: StringFieldUpdateOperationsInput | string
    nif?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    urlClientify?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    recetasContratadas?: IntFieldUpdateOperationsInput | number
    canManageRecipes?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipes?: RecipeUncheckedUpdateManyWithoutClientProfileNestedInput
    cleaningZones?: CleaningZoneUncheckedUpdateManyWithoutClientProfileNestedInput
    cleaningLogs?: CleaningLogUncheckedUpdateManyWithoutClientProfileNestedInput
    chambers?: ChamberUncheckedUpdateManyWithoutClientProfileNestedInput
    temperatureRecords?: TemperatureRecordUncheckedUpdateManyWithoutClientProfileNestedInput
  }

  export type RecipeCreateManyClientProfileInput = {
    id?: number
    name: string
    lotesMandatory?: boolean
    quantitiesMandatory?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CleaningZoneCreateManyClientProfileInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CleaningLogCreateManyClientProfileInput = {
    id?: number
    personName: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChamberCreateManyClientProfileInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemperatureRecordCreateManyClientProfileInput = {
    id?: number
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoodsReceiptCreateManyClientProfileInput = {
    id?: number
    providerName?: string | null
    productName: string
    lote?: string | null
    invoiceNumber?: string | null
    quantity?: string | null
    date?: Date | string
    deliveryNoteImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RecipeUpdateWithoutClientProfileInput = {
    name?: StringFieldUpdateOperationsInput | string
    lotesMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantitiesMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ingredients?: IngredientUpdateManyWithoutRecipeNestedInput
    elaborations?: ElaborationUpdateManyWithoutRecipeNestedInput
  }

  export type RecipeUncheckedUpdateWithoutClientProfileInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lotesMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantitiesMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ingredients?: IngredientUncheckedUpdateManyWithoutRecipeNestedInput
    elaborations?: ElaborationUncheckedUpdateManyWithoutRecipeNestedInput
  }

  export type RecipeUncheckedUpdateManyWithoutClientProfileInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lotesMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantitiesMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CleaningZoneUpdateWithoutClientProfileInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logs?: CleaningLogZoneUpdateManyWithoutCleaningZoneNestedInput
  }

  export type CleaningZoneUncheckedUpdateWithoutClientProfileInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logs?: CleaningLogZoneUncheckedUpdateManyWithoutCleaningZoneNestedInput
  }

  export type CleaningZoneUncheckedUpdateManyWithoutClientProfileInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CleaningLogUpdateWithoutClientProfileInput = {
    personName?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    zones?: CleaningLogZoneUpdateManyWithoutCleaningLogNestedInput
  }

  export type CleaningLogUncheckedUpdateWithoutClientProfileInput = {
    id?: IntFieldUpdateOperationsInput | number
    personName?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    zones?: CleaningLogZoneUncheckedUpdateManyWithoutCleaningLogNestedInput
  }

  export type CleaningLogUncheckedUpdateManyWithoutClientProfileInput = {
    id?: IntFieldUpdateOperationsInput | number
    personName?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChamberUpdateWithoutClientProfileInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    values?: TemperatureValueUpdateManyWithoutChamberNestedInput
  }

  export type ChamberUncheckedUpdateWithoutClientProfileInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    values?: TemperatureValueUncheckedUpdateManyWithoutChamberNestedInput
  }

  export type ChamberUncheckedUpdateManyWithoutClientProfileInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemperatureRecordUpdateWithoutClientProfileInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    values?: TemperatureValueUpdateManyWithoutRecordNestedInput
  }

  export type TemperatureRecordUncheckedUpdateWithoutClientProfileInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    values?: TemperatureValueUncheckedUpdateManyWithoutRecordNestedInput
  }

  export type TemperatureRecordUncheckedUpdateManyWithoutClientProfileInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoodsReceiptUpdateWithoutClientProfileInput = {
    providerName?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: StringFieldUpdateOperationsInput | string
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveryNoteImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoodsReceiptUncheckedUpdateWithoutClientProfileInput = {
    id?: IntFieldUpdateOperationsInput | number
    providerName?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: StringFieldUpdateOperationsInput | string
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveryNoteImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoodsReceiptUncheckedUpdateManyWithoutClientProfileInput = {
    id?: IntFieldUpdateOperationsInput | number
    providerName?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: StringFieldUpdateOperationsInput | string
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveryNoteImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngredientCreateManyRecipeInput = {
    id?: number
    name: string
    amount: string
    unit: string
    loteMandatory?: boolean
    quantityMandatory?: boolean
    createdAt?: Date | string
  }

  export type ElaborationCreateManyRecipeInput = {
    id?: number
    name: string
    date?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IngredientUpdateWithoutRecipeInput = {
    name?: StringFieldUpdateOperationsInput | string
    amount?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    loteMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantityMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngredientUncheckedUpdateWithoutRecipeInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    amount?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    loteMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantityMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngredientUncheckedUpdateManyWithoutRecipeInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    amount?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    loteMandatory?: BoolFieldUpdateOperationsInput | boolean
    quantityMandatory?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ElaborationUpdateWithoutRecipeInput = {
    name?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ingredients?: ElaborationIngredientUpdateManyWithoutElaborationNestedInput
  }

  export type ElaborationUncheckedUpdateWithoutRecipeInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ingredients?: ElaborationIngredientUncheckedUpdateManyWithoutElaborationNestedInput
  }

  export type ElaborationUncheckedUpdateManyWithoutRecipeInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ElaborationIngredientCreateManyElaborationInput = {
    id?: number
    name: string
    lote?: string | null
    realAmount: string
    unit: string
    createdAt?: Date | string
  }

  export type ElaborationIngredientUpdateWithoutElaborationInput = {
    name?: StringFieldUpdateOperationsInput | string
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    realAmount?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ElaborationIngredientUncheckedUpdateWithoutElaborationInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    realAmount?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ElaborationIngredientUncheckedUpdateManyWithoutElaborationInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lote?: NullableStringFieldUpdateOperationsInput | string | null
    realAmount?: StringFieldUpdateOperationsInput | string
    unit?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CleaningLogZoneCreateManyCleaningZoneInput = {
    cleaningLogId: number
  }

  export type CleaningLogZoneUpdateWithoutCleaningZoneInput = {
    cleaningLog?: CleaningLogUpdateOneRequiredWithoutZonesNestedInput
  }

  export type CleaningLogZoneUncheckedUpdateWithoutCleaningZoneInput = {
    cleaningLogId?: IntFieldUpdateOperationsInput | number
  }

  export type CleaningLogZoneUncheckedUpdateManyWithoutCleaningZoneInput = {
    cleaningLogId?: IntFieldUpdateOperationsInput | number
  }

  export type CleaningLogZoneCreateManyCleaningLogInput = {
    cleaningZoneId: number
  }

  export type CleaningLogZoneUpdateWithoutCleaningLogInput = {
    cleaningZone?: CleaningZoneUpdateOneRequiredWithoutLogsNestedInput
  }

  export type CleaningLogZoneUncheckedUpdateWithoutCleaningLogInput = {
    cleaningZoneId?: IntFieldUpdateOperationsInput | number
  }

  export type CleaningLogZoneUncheckedUpdateManyWithoutCleaningLogInput = {
    cleaningZoneId?: IntFieldUpdateOperationsInput | number
  }

  export type TemperatureValueCreateManyChamberInput = {
    id?: number
    value: number
    temperatureRecordId: number
  }

  export type TemperatureValueUpdateWithoutChamberInput = {
    value?: FloatFieldUpdateOperationsInput | number
    record?: TemperatureRecordUpdateOneRequiredWithoutValuesNestedInput
  }

  export type TemperatureValueUncheckedUpdateWithoutChamberInput = {
    id?: IntFieldUpdateOperationsInput | number
    value?: FloatFieldUpdateOperationsInput | number
    temperatureRecordId?: IntFieldUpdateOperationsInput | number
  }

  export type TemperatureValueUncheckedUpdateManyWithoutChamberInput = {
    id?: IntFieldUpdateOperationsInput | number
    value?: FloatFieldUpdateOperationsInput | number
    temperatureRecordId?: IntFieldUpdateOperationsInput | number
  }

  export type TemperatureValueCreateManyRecordInput = {
    id?: number
    value: number
    chamberId: number
  }

  export type TemperatureValueUpdateWithoutRecordInput = {
    value?: FloatFieldUpdateOperationsInput | number
    chamber?: ChamberUpdateOneRequiredWithoutValuesNestedInput
  }

  export type TemperatureValueUncheckedUpdateWithoutRecordInput = {
    id?: IntFieldUpdateOperationsInput | number
    value?: FloatFieldUpdateOperationsInput | number
    chamberId?: IntFieldUpdateOperationsInput | number
  }

  export type TemperatureValueUncheckedUpdateManyWithoutRecordInput = {
    id?: IntFieldUpdateOperationsInput | number
    value?: FloatFieldUpdateOperationsInput | number
    chamberId?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ClientProfileCountOutputTypeDefaultArgs instead
     */
    export type ClientProfileCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClientProfileCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RecipeCountOutputTypeDefaultArgs instead
     */
    export type RecipeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RecipeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ElaborationCountOutputTypeDefaultArgs instead
     */
    export type ElaborationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ElaborationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CleaningZoneCountOutputTypeDefaultArgs instead
     */
    export type CleaningZoneCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CleaningZoneCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CleaningLogCountOutputTypeDefaultArgs instead
     */
    export type CleaningLogCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CleaningLogCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChamberCountOutputTypeDefaultArgs instead
     */
    export type ChamberCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChamberCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TemperatureRecordCountOutputTypeDefaultArgs instead
     */
    export type TemperatureRecordCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TemperatureRecordCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClientProfileDefaultArgs instead
     */
    export type ClientProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClientProfileDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RecipeDefaultArgs instead
     */
    export type RecipeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RecipeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use IngredientDefaultArgs instead
     */
    export type IngredientArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = IngredientDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ElaborationDefaultArgs instead
     */
    export type ElaborationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ElaborationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ElaborationIngredientDefaultArgs instead
     */
    export type ElaborationIngredientArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ElaborationIngredientDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CleaningZoneDefaultArgs instead
     */
    export type CleaningZoneArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CleaningZoneDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CleaningLogDefaultArgs instead
     */
    export type CleaningLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CleaningLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CleaningLogZoneDefaultArgs instead
     */
    export type CleaningLogZoneArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CleaningLogZoneDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChamberDefaultArgs instead
     */
    export type ChamberArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChamberDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TemperatureRecordDefaultArgs instead
     */
    export type TemperatureRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TemperatureRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TemperatureValueDefaultArgs instead
     */
    export type TemperatureValueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TemperatureValueDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GoodsReceiptDefaultArgs instead
     */
    export type GoodsReceiptArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GoodsReceiptDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}