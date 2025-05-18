
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
 * Model SurveySubmission
 * 
 */
export type SurveySubmission = $Result.DefaultSelection<Prisma.$SurveySubmissionPayload>
/**
 * Model Location
 * 
 */
export type Location = $Result.DefaultSelection<Prisma.$LocationPayload>
/**
 * Model SubmissionLocation
 * 
 */
export type SubmissionLocation = $Result.DefaultSelection<Prisma.$SubmissionLocationPayload>
/**
 * Model Rating
 * 
 */
export type Rating = $Result.DefaultSelection<Prisma.$RatingPayload>
/**
 * Model GeneralObservation
 * 
 */
export type GeneralObservation = $Result.DefaultSelection<Prisma.$GeneralObservationPayload>
/**
 * Model DepartmentConcern
 * 
 */
export type DepartmentConcern = $Result.DefaultSelection<Prisma.$DepartmentConcernPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more SurveySubmissions
 * const surveySubmissions = await prisma.surveySubmission.findMany()
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
   * // Fetch zero or more SurveySubmissions
   * const surveySubmissions = await prisma.surveySubmission.findMany()
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
   * `prisma.surveySubmission`: Exposes CRUD operations for the **SurveySubmission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SurveySubmissions
    * const surveySubmissions = await prisma.surveySubmission.findMany()
    * ```
    */
  get surveySubmission(): Prisma.SurveySubmissionDelegate<ExtArgs>;

  /**
   * `prisma.location`: Exposes CRUD operations for the **Location** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Locations
    * const locations = await prisma.location.findMany()
    * ```
    */
  get location(): Prisma.LocationDelegate<ExtArgs>;

  /**
   * `prisma.submissionLocation`: Exposes CRUD operations for the **SubmissionLocation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubmissionLocations
    * const submissionLocations = await prisma.submissionLocation.findMany()
    * ```
    */
  get submissionLocation(): Prisma.SubmissionLocationDelegate<ExtArgs>;

  /**
   * `prisma.rating`: Exposes CRUD operations for the **Rating** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ratings
    * const ratings = await prisma.rating.findMany()
    * ```
    */
  get rating(): Prisma.RatingDelegate<ExtArgs>;

  /**
   * `prisma.generalObservation`: Exposes CRUD operations for the **GeneralObservation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GeneralObservations
    * const generalObservations = await prisma.generalObservation.findMany()
    * ```
    */
  get generalObservation(): Prisma.GeneralObservationDelegate<ExtArgs>;

  /**
   * `prisma.departmentConcern`: Exposes CRUD operations for the **DepartmentConcern** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DepartmentConcerns
    * const departmentConcerns = await prisma.departmentConcern.findMany()
    * ```
    */
  get departmentConcern(): Prisma.DepartmentConcernDelegate<ExtArgs>;
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
    SurveySubmission: 'SurveySubmission',
    Location: 'Location',
    SubmissionLocation: 'SubmissionLocation',
    Rating: 'Rating',
    GeneralObservation: 'GeneralObservation',
    DepartmentConcern: 'DepartmentConcern'
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
      modelProps: "surveySubmission" | "location" | "submissionLocation" | "rating" | "generalObservation" | "departmentConcern"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      SurveySubmission: {
        payload: Prisma.$SurveySubmissionPayload<ExtArgs>
        fields: Prisma.SurveySubmissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SurveySubmissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SurveySubmissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>
          }
          findFirst: {
            args: Prisma.SurveySubmissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SurveySubmissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>
          }
          findMany: {
            args: Prisma.SurveySubmissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>[]
          }
          create: {
            args: Prisma.SurveySubmissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>
          }
          createMany: {
            args: Prisma.SurveySubmissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SurveySubmissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>[]
          }
          delete: {
            args: Prisma.SurveySubmissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>
          }
          update: {
            args: Prisma.SurveySubmissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>
          }
          deleteMany: {
            args: Prisma.SurveySubmissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SurveySubmissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SurveySubmissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SurveySubmissionPayload>
          }
          aggregate: {
            args: Prisma.SurveySubmissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSurveySubmission>
          }
          groupBy: {
            args: Prisma.SurveySubmissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SurveySubmissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SurveySubmissionCountArgs<ExtArgs>
            result: $Utils.Optional<SurveySubmissionCountAggregateOutputType> | number
          }
        }
      }
      Location: {
        payload: Prisma.$LocationPayload<ExtArgs>
        fields: Prisma.LocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findFirst: {
            args: Prisma.LocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findMany: {
            args: Prisma.LocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          create: {
            args: Prisma.LocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          createMany: {
            args: Prisma.LocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          delete: {
            args: Prisma.LocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          update: {
            args: Prisma.LocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          deleteMany: {
            args: Prisma.LocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          aggregate: {
            args: Prisma.LocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocation>
          }
          groupBy: {
            args: Prisma.LocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocationCountArgs<ExtArgs>
            result: $Utils.Optional<LocationCountAggregateOutputType> | number
          }
        }
      }
      SubmissionLocation: {
        payload: Prisma.$SubmissionLocationPayload<ExtArgs>
        fields: Prisma.SubmissionLocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubmissionLocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionLocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubmissionLocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionLocationPayload>
          }
          findFirst: {
            args: Prisma.SubmissionLocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionLocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubmissionLocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionLocationPayload>
          }
          findMany: {
            args: Prisma.SubmissionLocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionLocationPayload>[]
          }
          create: {
            args: Prisma.SubmissionLocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionLocationPayload>
          }
          createMany: {
            args: Prisma.SubmissionLocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubmissionLocationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionLocationPayload>[]
          }
          delete: {
            args: Prisma.SubmissionLocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionLocationPayload>
          }
          update: {
            args: Prisma.SubmissionLocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionLocationPayload>
          }
          deleteMany: {
            args: Prisma.SubmissionLocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubmissionLocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SubmissionLocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubmissionLocationPayload>
          }
          aggregate: {
            args: Prisma.SubmissionLocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubmissionLocation>
          }
          groupBy: {
            args: Prisma.SubmissionLocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubmissionLocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubmissionLocationCountArgs<ExtArgs>
            result: $Utils.Optional<SubmissionLocationCountAggregateOutputType> | number
          }
        }
      }
      Rating: {
        payload: Prisma.$RatingPayload<ExtArgs>
        fields: Prisma.RatingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RatingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RatingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          findFirst: {
            args: Prisma.RatingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RatingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          findMany: {
            args: Prisma.RatingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>[]
          }
          create: {
            args: Prisma.RatingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          createMany: {
            args: Prisma.RatingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RatingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>[]
          }
          delete: {
            args: Prisma.RatingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          update: {
            args: Prisma.RatingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          deleteMany: {
            args: Prisma.RatingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RatingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RatingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingPayload>
          }
          aggregate: {
            args: Prisma.RatingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRating>
          }
          groupBy: {
            args: Prisma.RatingGroupByArgs<ExtArgs>
            result: $Utils.Optional<RatingGroupByOutputType>[]
          }
          count: {
            args: Prisma.RatingCountArgs<ExtArgs>
            result: $Utils.Optional<RatingCountAggregateOutputType> | number
          }
        }
      }
      GeneralObservation: {
        payload: Prisma.$GeneralObservationPayload<ExtArgs>
        fields: Prisma.GeneralObservationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GeneralObservationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneralObservationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GeneralObservationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneralObservationPayload>
          }
          findFirst: {
            args: Prisma.GeneralObservationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneralObservationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GeneralObservationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneralObservationPayload>
          }
          findMany: {
            args: Prisma.GeneralObservationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneralObservationPayload>[]
          }
          create: {
            args: Prisma.GeneralObservationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneralObservationPayload>
          }
          createMany: {
            args: Prisma.GeneralObservationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GeneralObservationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneralObservationPayload>[]
          }
          delete: {
            args: Prisma.GeneralObservationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneralObservationPayload>
          }
          update: {
            args: Prisma.GeneralObservationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneralObservationPayload>
          }
          deleteMany: {
            args: Prisma.GeneralObservationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GeneralObservationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GeneralObservationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneralObservationPayload>
          }
          aggregate: {
            args: Prisma.GeneralObservationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGeneralObservation>
          }
          groupBy: {
            args: Prisma.GeneralObservationGroupByArgs<ExtArgs>
            result: $Utils.Optional<GeneralObservationGroupByOutputType>[]
          }
          count: {
            args: Prisma.GeneralObservationCountArgs<ExtArgs>
            result: $Utils.Optional<GeneralObservationCountAggregateOutputType> | number
          }
        }
      }
      DepartmentConcern: {
        payload: Prisma.$DepartmentConcernPayload<ExtArgs>
        fields: Prisma.DepartmentConcernFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DepartmentConcernFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentConcernPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DepartmentConcernFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentConcernPayload>
          }
          findFirst: {
            args: Prisma.DepartmentConcernFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentConcernPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DepartmentConcernFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentConcernPayload>
          }
          findMany: {
            args: Prisma.DepartmentConcernFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentConcernPayload>[]
          }
          create: {
            args: Prisma.DepartmentConcernCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentConcernPayload>
          }
          createMany: {
            args: Prisma.DepartmentConcernCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DepartmentConcernCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentConcernPayload>[]
          }
          delete: {
            args: Prisma.DepartmentConcernDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentConcernPayload>
          }
          update: {
            args: Prisma.DepartmentConcernUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentConcernPayload>
          }
          deleteMany: {
            args: Prisma.DepartmentConcernDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DepartmentConcernUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DepartmentConcernUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentConcernPayload>
          }
          aggregate: {
            args: Prisma.DepartmentConcernAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDepartmentConcern>
          }
          groupBy: {
            args: Prisma.DepartmentConcernGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepartmentConcernGroupByOutputType>[]
          }
          count: {
            args: Prisma.DepartmentConcernCountArgs<ExtArgs>
            result: $Utils.Optional<DepartmentConcernCountAggregateOutputType> | number
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
   * Count Type SurveySubmissionCountOutputType
   */

  export type SurveySubmissionCountOutputType = {
    submissionLocations: number
    ratings: number
    departmentConcerns: number
  }

  export type SurveySubmissionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submissionLocations?: boolean | SurveySubmissionCountOutputTypeCountSubmissionLocationsArgs
    ratings?: boolean | SurveySubmissionCountOutputTypeCountRatingsArgs
    departmentConcerns?: boolean | SurveySubmissionCountOutputTypeCountDepartmentConcernsArgs
  }

  // Custom InputTypes
  /**
   * SurveySubmissionCountOutputType without action
   */
  export type SurveySubmissionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmissionCountOutputType
     */
    select?: SurveySubmissionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SurveySubmissionCountOutputType without action
   */
  export type SurveySubmissionCountOutputTypeCountSubmissionLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubmissionLocationWhereInput
  }

  /**
   * SurveySubmissionCountOutputType without action
   */
  export type SurveySubmissionCountOutputTypeCountRatingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RatingWhereInput
  }

  /**
   * SurveySubmissionCountOutputType without action
   */
  export type SurveySubmissionCountOutputTypeCountDepartmentConcernsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentConcernWhereInput
  }


  /**
   * Count Type LocationCountOutputType
   */

  export type LocationCountOutputType = {
    submissionLocations: number
    ratings: number
    departmentConcerns: number
  }

  export type LocationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submissionLocations?: boolean | LocationCountOutputTypeCountSubmissionLocationsArgs
    ratings?: boolean | LocationCountOutputTypeCountRatingsArgs
    departmentConcerns?: boolean | LocationCountOutputTypeCountDepartmentConcernsArgs
  }

  // Custom InputTypes
  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationCountOutputType
     */
    select?: LocationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeCountSubmissionLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubmissionLocationWhereInput
  }

  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeCountRatingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RatingWhereInput
  }

  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeCountDepartmentConcernsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentConcernWhereInput
  }


  /**
   * Models
   */

  /**
   * Model SurveySubmission
   */

  export type AggregateSurveySubmission = {
    _count: SurveySubmissionCountAggregateOutputType | null
    _min: SurveySubmissionMinAggregateOutputType | null
    _max: SurveySubmissionMaxAggregateOutputType | null
  }

  export type SurveySubmissionMinAggregateOutputType = {
    id: string | null
    visitTime: string | null
    visitPurpose: string | null
    visitedOtherPlaces: boolean | null
    wouldRecommend: boolean | null
    whyNotRecommend: string | null
    recommendation: string | null
    userType: string | null
    patientType: string | null
    submittedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SurveySubmissionMaxAggregateOutputType = {
    id: string | null
    visitTime: string | null
    visitPurpose: string | null
    visitedOtherPlaces: boolean | null
    wouldRecommend: boolean | null
    whyNotRecommend: string | null
    recommendation: string | null
    userType: string | null
    patientType: string | null
    submittedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SurveySubmissionCountAggregateOutputType = {
    id: number
    visitTime: number
    visitPurpose: number
    visitedOtherPlaces: number
    wouldRecommend: number
    whyNotRecommend: number
    recommendation: number
    userType: number
    patientType: number
    submittedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SurveySubmissionMinAggregateInputType = {
    id?: true
    visitTime?: true
    visitPurpose?: true
    visitedOtherPlaces?: true
    wouldRecommend?: true
    whyNotRecommend?: true
    recommendation?: true
    userType?: true
    patientType?: true
    submittedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SurveySubmissionMaxAggregateInputType = {
    id?: true
    visitTime?: true
    visitPurpose?: true
    visitedOtherPlaces?: true
    wouldRecommend?: true
    whyNotRecommend?: true
    recommendation?: true
    userType?: true
    patientType?: true
    submittedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SurveySubmissionCountAggregateInputType = {
    id?: true
    visitTime?: true
    visitPurpose?: true
    visitedOtherPlaces?: true
    wouldRecommend?: true
    whyNotRecommend?: true
    recommendation?: true
    userType?: true
    patientType?: true
    submittedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SurveySubmissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SurveySubmission to aggregate.
     */
    where?: SurveySubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SurveySubmissions to fetch.
     */
    orderBy?: SurveySubmissionOrderByWithRelationInput | SurveySubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SurveySubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SurveySubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SurveySubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SurveySubmissions
    **/
    _count?: true | SurveySubmissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SurveySubmissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SurveySubmissionMaxAggregateInputType
  }

  export type GetSurveySubmissionAggregateType<T extends SurveySubmissionAggregateArgs> = {
        [P in keyof T & keyof AggregateSurveySubmission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSurveySubmission[P]>
      : GetScalarType<T[P], AggregateSurveySubmission[P]>
  }




  export type SurveySubmissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SurveySubmissionWhereInput
    orderBy?: SurveySubmissionOrderByWithAggregationInput | SurveySubmissionOrderByWithAggregationInput[]
    by: SurveySubmissionScalarFieldEnum[] | SurveySubmissionScalarFieldEnum
    having?: SurveySubmissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SurveySubmissionCountAggregateInputType | true
    _min?: SurveySubmissionMinAggregateInputType
    _max?: SurveySubmissionMaxAggregateInputType
  }

  export type SurveySubmissionGroupByOutputType = {
    id: string
    visitTime: string
    visitPurpose: string
    visitedOtherPlaces: boolean
    wouldRecommend: boolean | null
    whyNotRecommend: string | null
    recommendation: string | null
    userType: string
    patientType: string
    submittedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: SurveySubmissionCountAggregateOutputType | null
    _min: SurveySubmissionMinAggregateOutputType | null
    _max: SurveySubmissionMaxAggregateOutputType | null
  }

  type GetSurveySubmissionGroupByPayload<T extends SurveySubmissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SurveySubmissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SurveySubmissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SurveySubmissionGroupByOutputType[P]>
            : GetScalarType<T[P], SurveySubmissionGroupByOutputType[P]>
        }
      >
    >


  export type SurveySubmissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    visitTime?: boolean
    visitPurpose?: boolean
    visitedOtherPlaces?: boolean
    wouldRecommend?: boolean
    whyNotRecommend?: boolean
    recommendation?: boolean
    userType?: boolean
    patientType?: boolean
    submittedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    submissionLocations?: boolean | SurveySubmission$submissionLocationsArgs<ExtArgs>
    ratings?: boolean | SurveySubmission$ratingsArgs<ExtArgs>
    generalObservations?: boolean | SurveySubmission$generalObservationsArgs<ExtArgs>
    departmentConcerns?: boolean | SurveySubmission$departmentConcernsArgs<ExtArgs>
    _count?: boolean | SurveySubmissionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["surveySubmission"]>

  export type SurveySubmissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    visitTime?: boolean
    visitPurpose?: boolean
    visitedOtherPlaces?: boolean
    wouldRecommend?: boolean
    whyNotRecommend?: boolean
    recommendation?: boolean
    userType?: boolean
    patientType?: boolean
    submittedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["surveySubmission"]>

  export type SurveySubmissionSelectScalar = {
    id?: boolean
    visitTime?: boolean
    visitPurpose?: boolean
    visitedOtherPlaces?: boolean
    wouldRecommend?: boolean
    whyNotRecommend?: boolean
    recommendation?: boolean
    userType?: boolean
    patientType?: boolean
    submittedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SurveySubmissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submissionLocations?: boolean | SurveySubmission$submissionLocationsArgs<ExtArgs>
    ratings?: boolean | SurveySubmission$ratingsArgs<ExtArgs>
    generalObservations?: boolean | SurveySubmission$generalObservationsArgs<ExtArgs>
    departmentConcerns?: boolean | SurveySubmission$departmentConcernsArgs<ExtArgs>
    _count?: boolean | SurveySubmissionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SurveySubmissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SurveySubmissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SurveySubmission"
    objects: {
      submissionLocations: Prisma.$SubmissionLocationPayload<ExtArgs>[]
      ratings: Prisma.$RatingPayload<ExtArgs>[]
      generalObservations: Prisma.$GeneralObservationPayload<ExtArgs> | null
      departmentConcerns: Prisma.$DepartmentConcernPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      visitTime: string
      visitPurpose: string
      visitedOtherPlaces: boolean
      wouldRecommend: boolean | null
      whyNotRecommend: string | null
      recommendation: string | null
      userType: string
      patientType: string
      submittedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["surveySubmission"]>
    composites: {}
  }

  type SurveySubmissionGetPayload<S extends boolean | null | undefined | SurveySubmissionDefaultArgs> = $Result.GetResult<Prisma.$SurveySubmissionPayload, S>

  type SurveySubmissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SurveySubmissionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SurveySubmissionCountAggregateInputType | true
    }

  export interface SurveySubmissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SurveySubmission'], meta: { name: 'SurveySubmission' } }
    /**
     * Find zero or one SurveySubmission that matches the filter.
     * @param {SurveySubmissionFindUniqueArgs} args - Arguments to find a SurveySubmission
     * @example
     * // Get one SurveySubmission
     * const surveySubmission = await prisma.surveySubmission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SurveySubmissionFindUniqueArgs>(args: SelectSubset<T, SurveySubmissionFindUniqueArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SurveySubmission that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SurveySubmissionFindUniqueOrThrowArgs} args - Arguments to find a SurveySubmission
     * @example
     * // Get one SurveySubmission
     * const surveySubmission = await prisma.surveySubmission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SurveySubmissionFindUniqueOrThrowArgs>(args: SelectSubset<T, SurveySubmissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SurveySubmission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SurveySubmissionFindFirstArgs} args - Arguments to find a SurveySubmission
     * @example
     * // Get one SurveySubmission
     * const surveySubmission = await prisma.surveySubmission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SurveySubmissionFindFirstArgs>(args?: SelectSubset<T, SurveySubmissionFindFirstArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SurveySubmission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SurveySubmissionFindFirstOrThrowArgs} args - Arguments to find a SurveySubmission
     * @example
     * // Get one SurveySubmission
     * const surveySubmission = await prisma.surveySubmission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SurveySubmissionFindFirstOrThrowArgs>(args?: SelectSubset<T, SurveySubmissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SurveySubmissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SurveySubmissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SurveySubmissions
     * const surveySubmissions = await prisma.surveySubmission.findMany()
     * 
     * // Get first 10 SurveySubmissions
     * const surveySubmissions = await prisma.surveySubmission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const surveySubmissionWithIdOnly = await prisma.surveySubmission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SurveySubmissionFindManyArgs>(args?: SelectSubset<T, SurveySubmissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SurveySubmission.
     * @param {SurveySubmissionCreateArgs} args - Arguments to create a SurveySubmission.
     * @example
     * // Create one SurveySubmission
     * const SurveySubmission = await prisma.surveySubmission.create({
     *   data: {
     *     // ... data to create a SurveySubmission
     *   }
     * })
     * 
     */
    create<T extends SurveySubmissionCreateArgs>(args: SelectSubset<T, SurveySubmissionCreateArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SurveySubmissions.
     * @param {SurveySubmissionCreateManyArgs} args - Arguments to create many SurveySubmissions.
     * @example
     * // Create many SurveySubmissions
     * const surveySubmission = await prisma.surveySubmission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SurveySubmissionCreateManyArgs>(args?: SelectSubset<T, SurveySubmissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SurveySubmissions and returns the data saved in the database.
     * @param {SurveySubmissionCreateManyAndReturnArgs} args - Arguments to create many SurveySubmissions.
     * @example
     * // Create many SurveySubmissions
     * const surveySubmission = await prisma.surveySubmission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SurveySubmissions and only return the `id`
     * const surveySubmissionWithIdOnly = await prisma.surveySubmission.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SurveySubmissionCreateManyAndReturnArgs>(args?: SelectSubset<T, SurveySubmissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SurveySubmission.
     * @param {SurveySubmissionDeleteArgs} args - Arguments to delete one SurveySubmission.
     * @example
     * // Delete one SurveySubmission
     * const SurveySubmission = await prisma.surveySubmission.delete({
     *   where: {
     *     // ... filter to delete one SurveySubmission
     *   }
     * })
     * 
     */
    delete<T extends SurveySubmissionDeleteArgs>(args: SelectSubset<T, SurveySubmissionDeleteArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SurveySubmission.
     * @param {SurveySubmissionUpdateArgs} args - Arguments to update one SurveySubmission.
     * @example
     * // Update one SurveySubmission
     * const surveySubmission = await prisma.surveySubmission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SurveySubmissionUpdateArgs>(args: SelectSubset<T, SurveySubmissionUpdateArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SurveySubmissions.
     * @param {SurveySubmissionDeleteManyArgs} args - Arguments to filter SurveySubmissions to delete.
     * @example
     * // Delete a few SurveySubmissions
     * const { count } = await prisma.surveySubmission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SurveySubmissionDeleteManyArgs>(args?: SelectSubset<T, SurveySubmissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SurveySubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SurveySubmissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SurveySubmissions
     * const surveySubmission = await prisma.surveySubmission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SurveySubmissionUpdateManyArgs>(args: SelectSubset<T, SurveySubmissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SurveySubmission.
     * @param {SurveySubmissionUpsertArgs} args - Arguments to update or create a SurveySubmission.
     * @example
     * // Update or create a SurveySubmission
     * const surveySubmission = await prisma.surveySubmission.upsert({
     *   create: {
     *     // ... data to create a SurveySubmission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SurveySubmission we want to update
     *   }
     * })
     */
    upsert<T extends SurveySubmissionUpsertArgs>(args: SelectSubset<T, SurveySubmissionUpsertArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SurveySubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SurveySubmissionCountArgs} args - Arguments to filter SurveySubmissions to count.
     * @example
     * // Count the number of SurveySubmissions
     * const count = await prisma.surveySubmission.count({
     *   where: {
     *     // ... the filter for the SurveySubmissions we want to count
     *   }
     * })
    **/
    count<T extends SurveySubmissionCountArgs>(
      args?: Subset<T, SurveySubmissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SurveySubmissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SurveySubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SurveySubmissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SurveySubmissionAggregateArgs>(args: Subset<T, SurveySubmissionAggregateArgs>): Prisma.PrismaPromise<GetSurveySubmissionAggregateType<T>>

    /**
     * Group by SurveySubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SurveySubmissionGroupByArgs} args - Group by arguments.
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
      T extends SurveySubmissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SurveySubmissionGroupByArgs['orderBy'] }
        : { orderBy?: SurveySubmissionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SurveySubmissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSurveySubmissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SurveySubmission model
   */
  readonly fields: SurveySubmissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SurveySubmission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SurveySubmissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    submissionLocations<T extends SurveySubmission$submissionLocationsArgs<ExtArgs> = {}>(args?: Subset<T, SurveySubmission$submissionLocationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionLocationPayload<ExtArgs>, T, "findMany"> | Null>
    ratings<T extends SurveySubmission$ratingsArgs<ExtArgs> = {}>(args?: Subset<T, SurveySubmission$ratingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findMany"> | Null>
    generalObservations<T extends SurveySubmission$generalObservationsArgs<ExtArgs> = {}>(args?: Subset<T, SurveySubmission$generalObservationsArgs<ExtArgs>>): Prisma__GeneralObservationClient<$Result.GetResult<Prisma.$GeneralObservationPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    departmentConcerns<T extends SurveySubmission$departmentConcernsArgs<ExtArgs> = {}>(args?: Subset<T, SurveySubmission$departmentConcernsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentConcernPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the SurveySubmission model
   */ 
  interface SurveySubmissionFieldRefs {
    readonly id: FieldRef<"SurveySubmission", 'String'>
    readonly visitTime: FieldRef<"SurveySubmission", 'String'>
    readonly visitPurpose: FieldRef<"SurveySubmission", 'String'>
    readonly visitedOtherPlaces: FieldRef<"SurveySubmission", 'Boolean'>
    readonly wouldRecommend: FieldRef<"SurveySubmission", 'Boolean'>
    readonly whyNotRecommend: FieldRef<"SurveySubmission", 'String'>
    readonly recommendation: FieldRef<"SurveySubmission", 'String'>
    readonly userType: FieldRef<"SurveySubmission", 'String'>
    readonly patientType: FieldRef<"SurveySubmission", 'String'>
    readonly submittedAt: FieldRef<"SurveySubmission", 'DateTime'>
    readonly createdAt: FieldRef<"SurveySubmission", 'DateTime'>
    readonly updatedAt: FieldRef<"SurveySubmission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SurveySubmission findUnique
   */
  export type SurveySubmissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * Filter, which SurveySubmission to fetch.
     */
    where: SurveySubmissionWhereUniqueInput
  }

  /**
   * SurveySubmission findUniqueOrThrow
   */
  export type SurveySubmissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * Filter, which SurveySubmission to fetch.
     */
    where: SurveySubmissionWhereUniqueInput
  }

  /**
   * SurveySubmission findFirst
   */
  export type SurveySubmissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * Filter, which SurveySubmission to fetch.
     */
    where?: SurveySubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SurveySubmissions to fetch.
     */
    orderBy?: SurveySubmissionOrderByWithRelationInput | SurveySubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SurveySubmissions.
     */
    cursor?: SurveySubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SurveySubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SurveySubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SurveySubmissions.
     */
    distinct?: SurveySubmissionScalarFieldEnum | SurveySubmissionScalarFieldEnum[]
  }

  /**
   * SurveySubmission findFirstOrThrow
   */
  export type SurveySubmissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * Filter, which SurveySubmission to fetch.
     */
    where?: SurveySubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SurveySubmissions to fetch.
     */
    orderBy?: SurveySubmissionOrderByWithRelationInput | SurveySubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SurveySubmissions.
     */
    cursor?: SurveySubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SurveySubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SurveySubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SurveySubmissions.
     */
    distinct?: SurveySubmissionScalarFieldEnum | SurveySubmissionScalarFieldEnum[]
  }

  /**
   * SurveySubmission findMany
   */
  export type SurveySubmissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * Filter, which SurveySubmissions to fetch.
     */
    where?: SurveySubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SurveySubmissions to fetch.
     */
    orderBy?: SurveySubmissionOrderByWithRelationInput | SurveySubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SurveySubmissions.
     */
    cursor?: SurveySubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SurveySubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SurveySubmissions.
     */
    skip?: number
    distinct?: SurveySubmissionScalarFieldEnum | SurveySubmissionScalarFieldEnum[]
  }

  /**
   * SurveySubmission create
   */
  export type SurveySubmissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * The data needed to create a SurveySubmission.
     */
    data: XOR<SurveySubmissionCreateInput, SurveySubmissionUncheckedCreateInput>
  }

  /**
   * SurveySubmission createMany
   */
  export type SurveySubmissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SurveySubmissions.
     */
    data: SurveySubmissionCreateManyInput | SurveySubmissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SurveySubmission createManyAndReturn
   */
  export type SurveySubmissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SurveySubmissions.
     */
    data: SurveySubmissionCreateManyInput | SurveySubmissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SurveySubmission update
   */
  export type SurveySubmissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * The data needed to update a SurveySubmission.
     */
    data: XOR<SurveySubmissionUpdateInput, SurveySubmissionUncheckedUpdateInput>
    /**
     * Choose, which SurveySubmission to update.
     */
    where: SurveySubmissionWhereUniqueInput
  }

  /**
   * SurveySubmission updateMany
   */
  export type SurveySubmissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SurveySubmissions.
     */
    data: XOR<SurveySubmissionUpdateManyMutationInput, SurveySubmissionUncheckedUpdateManyInput>
    /**
     * Filter which SurveySubmissions to update
     */
    where?: SurveySubmissionWhereInput
  }

  /**
   * SurveySubmission upsert
   */
  export type SurveySubmissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * The filter to search for the SurveySubmission to update in case it exists.
     */
    where: SurveySubmissionWhereUniqueInput
    /**
     * In case the SurveySubmission found by the `where` argument doesn't exist, create a new SurveySubmission with this data.
     */
    create: XOR<SurveySubmissionCreateInput, SurveySubmissionUncheckedCreateInput>
    /**
     * In case the SurveySubmission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SurveySubmissionUpdateInput, SurveySubmissionUncheckedUpdateInput>
  }

  /**
   * SurveySubmission delete
   */
  export type SurveySubmissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
    /**
     * Filter which SurveySubmission to delete.
     */
    where: SurveySubmissionWhereUniqueInput
  }

  /**
   * SurveySubmission deleteMany
   */
  export type SurveySubmissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SurveySubmissions to delete
     */
    where?: SurveySubmissionWhereInput
  }

  /**
   * SurveySubmission.submissionLocations
   */
  export type SurveySubmission$submissionLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionLocation
     */
    select?: SubmissionLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionLocationInclude<ExtArgs> | null
    where?: SubmissionLocationWhereInput
    orderBy?: SubmissionLocationOrderByWithRelationInput | SubmissionLocationOrderByWithRelationInput[]
    cursor?: SubmissionLocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubmissionLocationScalarFieldEnum | SubmissionLocationScalarFieldEnum[]
  }

  /**
   * SurveySubmission.ratings
   */
  export type SurveySubmission$ratingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    where?: RatingWhereInput
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    cursor?: RatingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[]
  }

  /**
   * SurveySubmission.generalObservations
   */
  export type SurveySubmission$generalObservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneralObservation
     */
    select?: GeneralObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneralObservationInclude<ExtArgs> | null
    where?: GeneralObservationWhereInput
  }

  /**
   * SurveySubmission.departmentConcerns
   */
  export type SurveySubmission$departmentConcernsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentConcern
     */
    select?: DepartmentConcernSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentConcernInclude<ExtArgs> | null
    where?: DepartmentConcernWhereInput
    orderBy?: DepartmentConcernOrderByWithRelationInput | DepartmentConcernOrderByWithRelationInput[]
    cursor?: DepartmentConcernWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DepartmentConcernScalarFieldEnum | DepartmentConcernScalarFieldEnum[]
  }

  /**
   * SurveySubmission without action
   */
  export type SurveySubmissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SurveySubmission
     */
    select?: SurveySubmissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SurveySubmissionInclude<ExtArgs> | null
  }


  /**
   * Model Location
   */

  export type AggregateLocation = {
    _count: LocationCountAggregateOutputType | null
    _avg: LocationAvgAggregateOutputType | null
    _sum: LocationSumAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  export type LocationAvgAggregateOutputType = {
    id: number | null
  }

  export type LocationSumAggregateOutputType = {
    id: number | null
  }

  export type LocationMinAggregateOutputType = {
    id: number | null
    name: string | null
    locationType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocationMaxAggregateOutputType = {
    id: number | null
    name: string | null
    locationType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocationCountAggregateOutputType = {
    id: number
    name: number
    locationType: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LocationAvgAggregateInputType = {
    id?: true
  }

  export type LocationSumAggregateInputType = {
    id?: true
  }

  export type LocationMinAggregateInputType = {
    id?: true
    name?: true
    locationType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocationMaxAggregateInputType = {
    id?: true
    name?: true
    locationType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocationCountAggregateInputType = {
    id?: true
    name?: true
    locationType?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Location to aggregate.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Locations
    **/
    _count?: true | LocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocationMaxAggregateInputType
  }

  export type GetLocationAggregateType<T extends LocationAggregateArgs> = {
        [P in keyof T & keyof AggregateLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocation[P]>
      : GetScalarType<T[P], AggregateLocation[P]>
  }




  export type LocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationWhereInput
    orderBy?: LocationOrderByWithAggregationInput | LocationOrderByWithAggregationInput[]
    by: LocationScalarFieldEnum[] | LocationScalarFieldEnum
    having?: LocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocationCountAggregateInputType | true
    _avg?: LocationAvgAggregateInputType
    _sum?: LocationSumAggregateInputType
    _min?: LocationMinAggregateInputType
    _max?: LocationMaxAggregateInputType
  }

  export type LocationGroupByOutputType = {
    id: number
    name: string
    locationType: string
    createdAt: Date
    updatedAt: Date
    _count: LocationCountAggregateOutputType | null
    _avg: LocationAvgAggregateOutputType | null
    _sum: LocationSumAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  type GetLocationGroupByPayload<T extends LocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocationGroupByOutputType[P]>
            : GetScalarType<T[P], LocationGroupByOutputType[P]>
        }
      >
    >


  export type LocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    locationType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    submissionLocations?: boolean | Location$submissionLocationsArgs<ExtArgs>
    ratings?: boolean | Location$ratingsArgs<ExtArgs>
    departmentConcerns?: boolean | Location$departmentConcernsArgs<ExtArgs>
    _count?: boolean | LocationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["location"]>

  export type LocationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    locationType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["location"]>

  export type LocationSelectScalar = {
    id?: boolean
    name?: boolean
    locationType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submissionLocations?: boolean | Location$submissionLocationsArgs<ExtArgs>
    ratings?: boolean | Location$ratingsArgs<ExtArgs>
    departmentConcerns?: boolean | Location$departmentConcernsArgs<ExtArgs>
    _count?: boolean | LocationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LocationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Location"
    objects: {
      submissionLocations: Prisma.$SubmissionLocationPayload<ExtArgs>[]
      ratings: Prisma.$RatingPayload<ExtArgs>[]
      departmentConcerns: Prisma.$DepartmentConcernPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      locationType: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["location"]>
    composites: {}
  }

  type LocationGetPayload<S extends boolean | null | undefined | LocationDefaultArgs> = $Result.GetResult<Prisma.$LocationPayload, S>

  type LocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LocationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LocationCountAggregateInputType | true
    }

  export interface LocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Location'], meta: { name: 'Location' } }
    /**
     * Find zero or one Location that matches the filter.
     * @param {LocationFindUniqueArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocationFindUniqueArgs>(args: SelectSubset<T, LocationFindUniqueArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Location that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LocationFindUniqueOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocationFindUniqueOrThrowArgs>(args: SelectSubset<T, LocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Location that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocationFindFirstArgs>(args?: SelectSubset<T, LocationFindFirstArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Location that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocationFindFirstOrThrowArgs>(args?: SelectSubset<T, LocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Locations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Locations
     * const locations = await prisma.location.findMany()
     * 
     * // Get first 10 Locations
     * const locations = await prisma.location.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const locationWithIdOnly = await prisma.location.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocationFindManyArgs>(args?: SelectSubset<T, LocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Location.
     * @param {LocationCreateArgs} args - Arguments to create a Location.
     * @example
     * // Create one Location
     * const Location = await prisma.location.create({
     *   data: {
     *     // ... data to create a Location
     *   }
     * })
     * 
     */
    create<T extends LocationCreateArgs>(args: SelectSubset<T, LocationCreateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Locations.
     * @param {LocationCreateManyArgs} args - Arguments to create many Locations.
     * @example
     * // Create many Locations
     * const location = await prisma.location.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocationCreateManyArgs>(args?: SelectSubset<T, LocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Locations and returns the data saved in the database.
     * @param {LocationCreateManyAndReturnArgs} args - Arguments to create many Locations.
     * @example
     * // Create many Locations
     * const location = await prisma.location.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Locations and only return the `id`
     * const locationWithIdOnly = await prisma.location.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocationCreateManyAndReturnArgs>(args?: SelectSubset<T, LocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Location.
     * @param {LocationDeleteArgs} args - Arguments to delete one Location.
     * @example
     * // Delete one Location
     * const Location = await prisma.location.delete({
     *   where: {
     *     // ... filter to delete one Location
     *   }
     * })
     * 
     */
    delete<T extends LocationDeleteArgs>(args: SelectSubset<T, LocationDeleteArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Location.
     * @param {LocationUpdateArgs} args - Arguments to update one Location.
     * @example
     * // Update one Location
     * const location = await prisma.location.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocationUpdateArgs>(args: SelectSubset<T, LocationUpdateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Locations.
     * @param {LocationDeleteManyArgs} args - Arguments to filter Locations to delete.
     * @example
     * // Delete a few Locations
     * const { count } = await prisma.location.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocationDeleteManyArgs>(args?: SelectSubset<T, LocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Locations
     * const location = await prisma.location.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocationUpdateManyArgs>(args: SelectSubset<T, LocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Location.
     * @param {LocationUpsertArgs} args - Arguments to update or create a Location.
     * @example
     * // Update or create a Location
     * const location = await prisma.location.upsert({
     *   create: {
     *     // ... data to create a Location
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Location we want to update
     *   }
     * })
     */
    upsert<T extends LocationUpsertArgs>(args: SelectSubset<T, LocationUpsertArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationCountArgs} args - Arguments to filter Locations to count.
     * @example
     * // Count the number of Locations
     * const count = await prisma.location.count({
     *   where: {
     *     // ... the filter for the Locations we want to count
     *   }
     * })
    **/
    count<T extends LocationCountArgs>(
      args?: Subset<T, LocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LocationAggregateArgs>(args: Subset<T, LocationAggregateArgs>): Prisma.PrismaPromise<GetLocationAggregateType<T>>

    /**
     * Group by Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationGroupByArgs} args - Group by arguments.
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
      T extends LocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocationGroupByArgs['orderBy'] }
        : { orderBy?: LocationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Location model
   */
  readonly fields: LocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Location.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    submissionLocations<T extends Location$submissionLocationsArgs<ExtArgs> = {}>(args?: Subset<T, Location$submissionLocationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionLocationPayload<ExtArgs>, T, "findMany"> | Null>
    ratings<T extends Location$ratingsArgs<ExtArgs> = {}>(args?: Subset<T, Location$ratingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findMany"> | Null>
    departmentConcerns<T extends Location$departmentConcernsArgs<ExtArgs> = {}>(args?: Subset<T, Location$departmentConcernsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentConcernPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Location model
   */ 
  interface LocationFieldRefs {
    readonly id: FieldRef<"Location", 'Int'>
    readonly name: FieldRef<"Location", 'String'>
    readonly locationType: FieldRef<"Location", 'String'>
    readonly createdAt: FieldRef<"Location", 'DateTime'>
    readonly updatedAt: FieldRef<"Location", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Location findUnique
   */
  export type LocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findUniqueOrThrow
   */
  export type LocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findFirst
   */
  export type LocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findFirstOrThrow
   */
  export type LocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findMany
   */
  export type LocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Locations to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location create
   */
  export type LocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to create a Location.
     */
    data: XOR<LocationCreateInput, LocationUncheckedCreateInput>
  }

  /**
   * Location createMany
   */
  export type LocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Locations.
     */
    data: LocationCreateManyInput | LocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Location createManyAndReturn
   */
  export type LocationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Locations.
     */
    data: LocationCreateManyInput | LocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Location update
   */
  export type LocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to update a Location.
     */
    data: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
    /**
     * Choose, which Location to update.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location updateMany
   */
  export type LocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Locations.
     */
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyInput>
    /**
     * Filter which Locations to update
     */
    where?: LocationWhereInput
  }

  /**
   * Location upsert
   */
  export type LocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The filter to search for the Location to update in case it exists.
     */
    where: LocationWhereUniqueInput
    /**
     * In case the Location found by the `where` argument doesn't exist, create a new Location with this data.
     */
    create: XOR<LocationCreateInput, LocationUncheckedCreateInput>
    /**
     * In case the Location was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
  }

  /**
   * Location delete
   */
  export type LocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter which Location to delete.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location deleteMany
   */
  export type LocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Locations to delete
     */
    where?: LocationWhereInput
  }

  /**
   * Location.submissionLocations
   */
  export type Location$submissionLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionLocation
     */
    select?: SubmissionLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionLocationInclude<ExtArgs> | null
    where?: SubmissionLocationWhereInput
    orderBy?: SubmissionLocationOrderByWithRelationInput | SubmissionLocationOrderByWithRelationInput[]
    cursor?: SubmissionLocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubmissionLocationScalarFieldEnum | SubmissionLocationScalarFieldEnum[]
  }

  /**
   * Location.ratings
   */
  export type Location$ratingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    where?: RatingWhereInput
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    cursor?: RatingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[]
  }

  /**
   * Location.departmentConcerns
   */
  export type Location$departmentConcernsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentConcern
     */
    select?: DepartmentConcernSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentConcernInclude<ExtArgs> | null
    where?: DepartmentConcernWhereInput
    orderBy?: DepartmentConcernOrderByWithRelationInput | DepartmentConcernOrderByWithRelationInput[]
    cursor?: DepartmentConcernWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DepartmentConcernScalarFieldEnum | DepartmentConcernScalarFieldEnum[]
  }

  /**
   * Location without action
   */
  export type LocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
  }


  /**
   * Model SubmissionLocation
   */

  export type AggregateSubmissionLocation = {
    _count: SubmissionLocationCountAggregateOutputType | null
    _avg: SubmissionLocationAvgAggregateOutputType | null
    _sum: SubmissionLocationSumAggregateOutputType | null
    _min: SubmissionLocationMinAggregateOutputType | null
    _max: SubmissionLocationMaxAggregateOutputType | null
  }

  export type SubmissionLocationAvgAggregateOutputType = {
    id: number | null
    locationId: number | null
  }

  export type SubmissionLocationSumAggregateOutputType = {
    id: number | null
    locationId: number | null
  }

  export type SubmissionLocationMinAggregateOutputType = {
    id: number | null
    submissionId: string | null
    locationId: number | null
    isPrimary: boolean | null
    createdAt: Date | null
  }

  export type SubmissionLocationMaxAggregateOutputType = {
    id: number | null
    submissionId: string | null
    locationId: number | null
    isPrimary: boolean | null
    createdAt: Date | null
  }

  export type SubmissionLocationCountAggregateOutputType = {
    id: number
    submissionId: number
    locationId: number
    isPrimary: number
    createdAt: number
    _all: number
  }


  export type SubmissionLocationAvgAggregateInputType = {
    id?: true
    locationId?: true
  }

  export type SubmissionLocationSumAggregateInputType = {
    id?: true
    locationId?: true
  }

  export type SubmissionLocationMinAggregateInputType = {
    id?: true
    submissionId?: true
    locationId?: true
    isPrimary?: true
    createdAt?: true
  }

  export type SubmissionLocationMaxAggregateInputType = {
    id?: true
    submissionId?: true
    locationId?: true
    isPrimary?: true
    createdAt?: true
  }

  export type SubmissionLocationCountAggregateInputType = {
    id?: true
    submissionId?: true
    locationId?: true
    isPrimary?: true
    createdAt?: true
    _all?: true
  }

  export type SubmissionLocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubmissionLocation to aggregate.
     */
    where?: SubmissionLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubmissionLocations to fetch.
     */
    orderBy?: SubmissionLocationOrderByWithRelationInput | SubmissionLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubmissionLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubmissionLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubmissionLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubmissionLocations
    **/
    _count?: true | SubmissionLocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubmissionLocationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubmissionLocationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubmissionLocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubmissionLocationMaxAggregateInputType
  }

  export type GetSubmissionLocationAggregateType<T extends SubmissionLocationAggregateArgs> = {
        [P in keyof T & keyof AggregateSubmissionLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubmissionLocation[P]>
      : GetScalarType<T[P], AggregateSubmissionLocation[P]>
  }




  export type SubmissionLocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubmissionLocationWhereInput
    orderBy?: SubmissionLocationOrderByWithAggregationInput | SubmissionLocationOrderByWithAggregationInput[]
    by: SubmissionLocationScalarFieldEnum[] | SubmissionLocationScalarFieldEnum
    having?: SubmissionLocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubmissionLocationCountAggregateInputType | true
    _avg?: SubmissionLocationAvgAggregateInputType
    _sum?: SubmissionLocationSumAggregateInputType
    _min?: SubmissionLocationMinAggregateInputType
    _max?: SubmissionLocationMaxAggregateInputType
  }

  export type SubmissionLocationGroupByOutputType = {
    id: number
    submissionId: string
    locationId: number
    isPrimary: boolean
    createdAt: Date
    _count: SubmissionLocationCountAggregateOutputType | null
    _avg: SubmissionLocationAvgAggregateOutputType | null
    _sum: SubmissionLocationSumAggregateOutputType | null
    _min: SubmissionLocationMinAggregateOutputType | null
    _max: SubmissionLocationMaxAggregateOutputType | null
  }

  type GetSubmissionLocationGroupByPayload<T extends SubmissionLocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubmissionLocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubmissionLocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubmissionLocationGroupByOutputType[P]>
            : GetScalarType<T[P], SubmissionLocationGroupByOutputType[P]>
        }
      >
    >


  export type SubmissionLocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    locationId?: boolean
    isPrimary?: boolean
    createdAt?: boolean
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["submissionLocation"]>

  export type SubmissionLocationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    locationId?: boolean
    isPrimary?: boolean
    createdAt?: boolean
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["submissionLocation"]>

  export type SubmissionLocationSelectScalar = {
    id?: boolean
    submissionId?: boolean
    locationId?: boolean
    isPrimary?: boolean
    createdAt?: boolean
  }

  export type SubmissionLocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }
  export type SubmissionLocationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }

  export type $SubmissionLocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SubmissionLocation"
    objects: {
      submission: Prisma.$SurveySubmissionPayload<ExtArgs>
      location: Prisma.$LocationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      submissionId: string
      locationId: number
      isPrimary: boolean
      createdAt: Date
    }, ExtArgs["result"]["submissionLocation"]>
    composites: {}
  }

  type SubmissionLocationGetPayload<S extends boolean | null | undefined | SubmissionLocationDefaultArgs> = $Result.GetResult<Prisma.$SubmissionLocationPayload, S>

  type SubmissionLocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SubmissionLocationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SubmissionLocationCountAggregateInputType | true
    }

  export interface SubmissionLocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubmissionLocation'], meta: { name: 'SubmissionLocation' } }
    /**
     * Find zero or one SubmissionLocation that matches the filter.
     * @param {SubmissionLocationFindUniqueArgs} args - Arguments to find a SubmissionLocation
     * @example
     * // Get one SubmissionLocation
     * const submissionLocation = await prisma.submissionLocation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubmissionLocationFindUniqueArgs>(args: SelectSubset<T, SubmissionLocationFindUniqueArgs<ExtArgs>>): Prisma__SubmissionLocationClient<$Result.GetResult<Prisma.$SubmissionLocationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SubmissionLocation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SubmissionLocationFindUniqueOrThrowArgs} args - Arguments to find a SubmissionLocation
     * @example
     * // Get one SubmissionLocation
     * const submissionLocation = await prisma.submissionLocation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubmissionLocationFindUniqueOrThrowArgs>(args: SelectSubset<T, SubmissionLocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubmissionLocationClient<$Result.GetResult<Prisma.$SubmissionLocationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SubmissionLocation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionLocationFindFirstArgs} args - Arguments to find a SubmissionLocation
     * @example
     * // Get one SubmissionLocation
     * const submissionLocation = await prisma.submissionLocation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubmissionLocationFindFirstArgs>(args?: SelectSubset<T, SubmissionLocationFindFirstArgs<ExtArgs>>): Prisma__SubmissionLocationClient<$Result.GetResult<Prisma.$SubmissionLocationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SubmissionLocation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionLocationFindFirstOrThrowArgs} args - Arguments to find a SubmissionLocation
     * @example
     * // Get one SubmissionLocation
     * const submissionLocation = await prisma.submissionLocation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubmissionLocationFindFirstOrThrowArgs>(args?: SelectSubset<T, SubmissionLocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubmissionLocationClient<$Result.GetResult<Prisma.$SubmissionLocationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SubmissionLocations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionLocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubmissionLocations
     * const submissionLocations = await prisma.submissionLocation.findMany()
     * 
     * // Get first 10 SubmissionLocations
     * const submissionLocations = await prisma.submissionLocation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const submissionLocationWithIdOnly = await prisma.submissionLocation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubmissionLocationFindManyArgs>(args?: SelectSubset<T, SubmissionLocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionLocationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SubmissionLocation.
     * @param {SubmissionLocationCreateArgs} args - Arguments to create a SubmissionLocation.
     * @example
     * // Create one SubmissionLocation
     * const SubmissionLocation = await prisma.submissionLocation.create({
     *   data: {
     *     // ... data to create a SubmissionLocation
     *   }
     * })
     * 
     */
    create<T extends SubmissionLocationCreateArgs>(args: SelectSubset<T, SubmissionLocationCreateArgs<ExtArgs>>): Prisma__SubmissionLocationClient<$Result.GetResult<Prisma.$SubmissionLocationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SubmissionLocations.
     * @param {SubmissionLocationCreateManyArgs} args - Arguments to create many SubmissionLocations.
     * @example
     * // Create many SubmissionLocations
     * const submissionLocation = await prisma.submissionLocation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubmissionLocationCreateManyArgs>(args?: SelectSubset<T, SubmissionLocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SubmissionLocations and returns the data saved in the database.
     * @param {SubmissionLocationCreateManyAndReturnArgs} args - Arguments to create many SubmissionLocations.
     * @example
     * // Create many SubmissionLocations
     * const submissionLocation = await prisma.submissionLocation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SubmissionLocations and only return the `id`
     * const submissionLocationWithIdOnly = await prisma.submissionLocation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubmissionLocationCreateManyAndReturnArgs>(args?: SelectSubset<T, SubmissionLocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubmissionLocationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SubmissionLocation.
     * @param {SubmissionLocationDeleteArgs} args - Arguments to delete one SubmissionLocation.
     * @example
     * // Delete one SubmissionLocation
     * const SubmissionLocation = await prisma.submissionLocation.delete({
     *   where: {
     *     // ... filter to delete one SubmissionLocation
     *   }
     * })
     * 
     */
    delete<T extends SubmissionLocationDeleteArgs>(args: SelectSubset<T, SubmissionLocationDeleteArgs<ExtArgs>>): Prisma__SubmissionLocationClient<$Result.GetResult<Prisma.$SubmissionLocationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SubmissionLocation.
     * @param {SubmissionLocationUpdateArgs} args - Arguments to update one SubmissionLocation.
     * @example
     * // Update one SubmissionLocation
     * const submissionLocation = await prisma.submissionLocation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubmissionLocationUpdateArgs>(args: SelectSubset<T, SubmissionLocationUpdateArgs<ExtArgs>>): Prisma__SubmissionLocationClient<$Result.GetResult<Prisma.$SubmissionLocationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SubmissionLocations.
     * @param {SubmissionLocationDeleteManyArgs} args - Arguments to filter SubmissionLocations to delete.
     * @example
     * // Delete a few SubmissionLocations
     * const { count } = await prisma.submissionLocation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubmissionLocationDeleteManyArgs>(args?: SelectSubset<T, SubmissionLocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubmissionLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionLocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubmissionLocations
     * const submissionLocation = await prisma.submissionLocation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubmissionLocationUpdateManyArgs>(args: SelectSubset<T, SubmissionLocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SubmissionLocation.
     * @param {SubmissionLocationUpsertArgs} args - Arguments to update or create a SubmissionLocation.
     * @example
     * // Update or create a SubmissionLocation
     * const submissionLocation = await prisma.submissionLocation.upsert({
     *   create: {
     *     // ... data to create a SubmissionLocation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubmissionLocation we want to update
     *   }
     * })
     */
    upsert<T extends SubmissionLocationUpsertArgs>(args: SelectSubset<T, SubmissionLocationUpsertArgs<ExtArgs>>): Prisma__SubmissionLocationClient<$Result.GetResult<Prisma.$SubmissionLocationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SubmissionLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionLocationCountArgs} args - Arguments to filter SubmissionLocations to count.
     * @example
     * // Count the number of SubmissionLocations
     * const count = await prisma.submissionLocation.count({
     *   where: {
     *     // ... the filter for the SubmissionLocations we want to count
     *   }
     * })
    **/
    count<T extends SubmissionLocationCountArgs>(
      args?: Subset<T, SubmissionLocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubmissionLocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubmissionLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionLocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SubmissionLocationAggregateArgs>(args: Subset<T, SubmissionLocationAggregateArgs>): Prisma.PrismaPromise<GetSubmissionLocationAggregateType<T>>

    /**
     * Group by SubmissionLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubmissionLocationGroupByArgs} args - Group by arguments.
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
      T extends SubmissionLocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubmissionLocationGroupByArgs['orderBy'] }
        : { orderBy?: SubmissionLocationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SubmissionLocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubmissionLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SubmissionLocation model
   */
  readonly fields: SubmissionLocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubmissionLocation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubmissionLocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    submission<T extends SurveySubmissionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SurveySubmissionDefaultArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    location<T extends LocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocationDefaultArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the SubmissionLocation model
   */ 
  interface SubmissionLocationFieldRefs {
    readonly id: FieldRef<"SubmissionLocation", 'Int'>
    readonly submissionId: FieldRef<"SubmissionLocation", 'String'>
    readonly locationId: FieldRef<"SubmissionLocation", 'Int'>
    readonly isPrimary: FieldRef<"SubmissionLocation", 'Boolean'>
    readonly createdAt: FieldRef<"SubmissionLocation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SubmissionLocation findUnique
   */
  export type SubmissionLocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionLocation
     */
    select?: SubmissionLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionLocationInclude<ExtArgs> | null
    /**
     * Filter, which SubmissionLocation to fetch.
     */
    where: SubmissionLocationWhereUniqueInput
  }

  /**
   * SubmissionLocation findUniqueOrThrow
   */
  export type SubmissionLocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionLocation
     */
    select?: SubmissionLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionLocationInclude<ExtArgs> | null
    /**
     * Filter, which SubmissionLocation to fetch.
     */
    where: SubmissionLocationWhereUniqueInput
  }

  /**
   * SubmissionLocation findFirst
   */
  export type SubmissionLocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionLocation
     */
    select?: SubmissionLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionLocationInclude<ExtArgs> | null
    /**
     * Filter, which SubmissionLocation to fetch.
     */
    where?: SubmissionLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubmissionLocations to fetch.
     */
    orderBy?: SubmissionLocationOrderByWithRelationInput | SubmissionLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubmissionLocations.
     */
    cursor?: SubmissionLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubmissionLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubmissionLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubmissionLocations.
     */
    distinct?: SubmissionLocationScalarFieldEnum | SubmissionLocationScalarFieldEnum[]
  }

  /**
   * SubmissionLocation findFirstOrThrow
   */
  export type SubmissionLocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionLocation
     */
    select?: SubmissionLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionLocationInclude<ExtArgs> | null
    /**
     * Filter, which SubmissionLocation to fetch.
     */
    where?: SubmissionLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubmissionLocations to fetch.
     */
    orderBy?: SubmissionLocationOrderByWithRelationInput | SubmissionLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubmissionLocations.
     */
    cursor?: SubmissionLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubmissionLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubmissionLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubmissionLocations.
     */
    distinct?: SubmissionLocationScalarFieldEnum | SubmissionLocationScalarFieldEnum[]
  }

  /**
   * SubmissionLocation findMany
   */
  export type SubmissionLocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionLocation
     */
    select?: SubmissionLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionLocationInclude<ExtArgs> | null
    /**
     * Filter, which SubmissionLocations to fetch.
     */
    where?: SubmissionLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubmissionLocations to fetch.
     */
    orderBy?: SubmissionLocationOrderByWithRelationInput | SubmissionLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubmissionLocations.
     */
    cursor?: SubmissionLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubmissionLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubmissionLocations.
     */
    skip?: number
    distinct?: SubmissionLocationScalarFieldEnum | SubmissionLocationScalarFieldEnum[]
  }

  /**
   * SubmissionLocation create
   */
  export type SubmissionLocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionLocation
     */
    select?: SubmissionLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionLocationInclude<ExtArgs> | null
    /**
     * The data needed to create a SubmissionLocation.
     */
    data: XOR<SubmissionLocationCreateInput, SubmissionLocationUncheckedCreateInput>
  }

  /**
   * SubmissionLocation createMany
   */
  export type SubmissionLocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubmissionLocations.
     */
    data: SubmissionLocationCreateManyInput | SubmissionLocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubmissionLocation createManyAndReturn
   */
  export type SubmissionLocationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionLocation
     */
    select?: SubmissionLocationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SubmissionLocations.
     */
    data: SubmissionLocationCreateManyInput | SubmissionLocationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionLocationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SubmissionLocation update
   */
  export type SubmissionLocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionLocation
     */
    select?: SubmissionLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionLocationInclude<ExtArgs> | null
    /**
     * The data needed to update a SubmissionLocation.
     */
    data: XOR<SubmissionLocationUpdateInput, SubmissionLocationUncheckedUpdateInput>
    /**
     * Choose, which SubmissionLocation to update.
     */
    where: SubmissionLocationWhereUniqueInput
  }

  /**
   * SubmissionLocation updateMany
   */
  export type SubmissionLocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubmissionLocations.
     */
    data: XOR<SubmissionLocationUpdateManyMutationInput, SubmissionLocationUncheckedUpdateManyInput>
    /**
     * Filter which SubmissionLocations to update
     */
    where?: SubmissionLocationWhereInput
  }

  /**
   * SubmissionLocation upsert
   */
  export type SubmissionLocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionLocation
     */
    select?: SubmissionLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionLocationInclude<ExtArgs> | null
    /**
     * The filter to search for the SubmissionLocation to update in case it exists.
     */
    where: SubmissionLocationWhereUniqueInput
    /**
     * In case the SubmissionLocation found by the `where` argument doesn't exist, create a new SubmissionLocation with this data.
     */
    create: XOR<SubmissionLocationCreateInput, SubmissionLocationUncheckedCreateInput>
    /**
     * In case the SubmissionLocation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubmissionLocationUpdateInput, SubmissionLocationUncheckedUpdateInput>
  }

  /**
   * SubmissionLocation delete
   */
  export type SubmissionLocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionLocation
     */
    select?: SubmissionLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionLocationInclude<ExtArgs> | null
    /**
     * Filter which SubmissionLocation to delete.
     */
    where: SubmissionLocationWhereUniqueInput
  }

  /**
   * SubmissionLocation deleteMany
   */
  export type SubmissionLocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubmissionLocations to delete
     */
    where?: SubmissionLocationWhereInput
  }

  /**
   * SubmissionLocation without action
   */
  export type SubmissionLocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubmissionLocation
     */
    select?: SubmissionLocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubmissionLocationInclude<ExtArgs> | null
  }


  /**
   * Model Rating
   */

  export type AggregateRating = {
    _count: RatingCountAggregateOutputType | null
    _avg: RatingAvgAggregateOutputType | null
    _sum: RatingSumAggregateOutputType | null
    _min: RatingMinAggregateOutputType | null
    _max: RatingMaxAggregateOutputType | null
  }

  export type RatingAvgAggregateOutputType = {
    id: number | null
    locationId: number | null
  }

  export type RatingSumAggregateOutputType = {
    id: number | null
    locationId: number | null
  }

  export type RatingMinAggregateOutputType = {
    id: number | null
    submissionId: string | null
    locationId: number | null
    reception: string | null
    professionalism: string | null
    understanding: string | null
    promptnessCare: string | null
    promptnessFeedback: string | null
    overall: string | null
    admission: string | null
    nurseProfessionalism: string | null
    doctorProfessionalism: string | null
    discharge: string | null
    foodQuality: string | null
    createdAt: Date | null
  }

  export type RatingMaxAggregateOutputType = {
    id: number | null
    submissionId: string | null
    locationId: number | null
    reception: string | null
    professionalism: string | null
    understanding: string | null
    promptnessCare: string | null
    promptnessFeedback: string | null
    overall: string | null
    admission: string | null
    nurseProfessionalism: string | null
    doctorProfessionalism: string | null
    discharge: string | null
    foodQuality: string | null
    createdAt: Date | null
  }

  export type RatingCountAggregateOutputType = {
    id: number
    submissionId: number
    locationId: number
    reception: number
    professionalism: number
    understanding: number
    promptnessCare: number
    promptnessFeedback: number
    overall: number
    admission: number
    nurseProfessionalism: number
    doctorProfessionalism: number
    discharge: number
    foodQuality: number
    createdAt: number
    _all: number
  }


  export type RatingAvgAggregateInputType = {
    id?: true
    locationId?: true
  }

  export type RatingSumAggregateInputType = {
    id?: true
    locationId?: true
  }

  export type RatingMinAggregateInputType = {
    id?: true
    submissionId?: true
    locationId?: true
    reception?: true
    professionalism?: true
    understanding?: true
    promptnessCare?: true
    promptnessFeedback?: true
    overall?: true
    admission?: true
    nurseProfessionalism?: true
    doctorProfessionalism?: true
    discharge?: true
    foodQuality?: true
    createdAt?: true
  }

  export type RatingMaxAggregateInputType = {
    id?: true
    submissionId?: true
    locationId?: true
    reception?: true
    professionalism?: true
    understanding?: true
    promptnessCare?: true
    promptnessFeedback?: true
    overall?: true
    admission?: true
    nurseProfessionalism?: true
    doctorProfessionalism?: true
    discharge?: true
    foodQuality?: true
    createdAt?: true
  }

  export type RatingCountAggregateInputType = {
    id?: true
    submissionId?: true
    locationId?: true
    reception?: true
    professionalism?: true
    understanding?: true
    promptnessCare?: true
    promptnessFeedback?: true
    overall?: true
    admission?: true
    nurseProfessionalism?: true
    doctorProfessionalism?: true
    discharge?: true
    foodQuality?: true
    createdAt?: true
    _all?: true
  }

  export type RatingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rating to aggregate.
     */
    where?: RatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ratings to fetch.
     */
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ratings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ratings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ratings
    **/
    _count?: true | RatingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RatingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RatingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RatingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RatingMaxAggregateInputType
  }

  export type GetRatingAggregateType<T extends RatingAggregateArgs> = {
        [P in keyof T & keyof AggregateRating]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRating[P]>
      : GetScalarType<T[P], AggregateRating[P]>
  }




  export type RatingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RatingWhereInput
    orderBy?: RatingOrderByWithAggregationInput | RatingOrderByWithAggregationInput[]
    by: RatingScalarFieldEnum[] | RatingScalarFieldEnum
    having?: RatingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RatingCountAggregateInputType | true
    _avg?: RatingAvgAggregateInputType
    _sum?: RatingSumAggregateInputType
    _min?: RatingMinAggregateInputType
    _max?: RatingMaxAggregateInputType
  }

  export type RatingGroupByOutputType = {
    id: number
    submissionId: string
    locationId: number
    reception: string | null
    professionalism: string | null
    understanding: string | null
    promptnessCare: string | null
    promptnessFeedback: string | null
    overall: string | null
    admission: string | null
    nurseProfessionalism: string | null
    doctorProfessionalism: string | null
    discharge: string | null
    foodQuality: string | null
    createdAt: Date
    _count: RatingCountAggregateOutputType | null
    _avg: RatingAvgAggregateOutputType | null
    _sum: RatingSumAggregateOutputType | null
    _min: RatingMinAggregateOutputType | null
    _max: RatingMaxAggregateOutputType | null
  }

  type GetRatingGroupByPayload<T extends RatingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RatingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RatingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RatingGroupByOutputType[P]>
            : GetScalarType<T[P], RatingGroupByOutputType[P]>
        }
      >
    >


  export type RatingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    locationId?: boolean
    reception?: boolean
    professionalism?: boolean
    understanding?: boolean
    promptnessCare?: boolean
    promptnessFeedback?: boolean
    overall?: boolean
    admission?: boolean
    nurseProfessionalism?: boolean
    doctorProfessionalism?: boolean
    discharge?: boolean
    foodQuality?: boolean
    createdAt?: boolean
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rating"]>

  export type RatingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    locationId?: boolean
    reception?: boolean
    professionalism?: boolean
    understanding?: boolean
    promptnessCare?: boolean
    promptnessFeedback?: boolean
    overall?: boolean
    admission?: boolean
    nurseProfessionalism?: boolean
    doctorProfessionalism?: boolean
    discharge?: boolean
    foodQuality?: boolean
    createdAt?: boolean
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rating"]>

  export type RatingSelectScalar = {
    id?: boolean
    submissionId?: boolean
    locationId?: boolean
    reception?: boolean
    professionalism?: boolean
    understanding?: boolean
    promptnessCare?: boolean
    promptnessFeedback?: boolean
    overall?: boolean
    admission?: boolean
    nurseProfessionalism?: boolean
    doctorProfessionalism?: boolean
    discharge?: boolean
    foodQuality?: boolean
    createdAt?: boolean
  }

  export type RatingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }
  export type RatingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }

  export type $RatingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Rating"
    objects: {
      submission: Prisma.$SurveySubmissionPayload<ExtArgs>
      location: Prisma.$LocationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      submissionId: string
      locationId: number
      reception: string | null
      professionalism: string | null
      understanding: string | null
      promptnessCare: string | null
      promptnessFeedback: string | null
      overall: string | null
      admission: string | null
      nurseProfessionalism: string | null
      doctorProfessionalism: string | null
      discharge: string | null
      foodQuality: string | null
      createdAt: Date
    }, ExtArgs["result"]["rating"]>
    composites: {}
  }

  type RatingGetPayload<S extends boolean | null | undefined | RatingDefaultArgs> = $Result.GetResult<Prisma.$RatingPayload, S>

  type RatingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RatingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RatingCountAggregateInputType | true
    }

  export interface RatingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Rating'], meta: { name: 'Rating' } }
    /**
     * Find zero or one Rating that matches the filter.
     * @param {RatingFindUniqueArgs} args - Arguments to find a Rating
     * @example
     * // Get one Rating
     * const rating = await prisma.rating.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RatingFindUniqueArgs>(args: SelectSubset<T, RatingFindUniqueArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Rating that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RatingFindUniqueOrThrowArgs} args - Arguments to find a Rating
     * @example
     * // Get one Rating
     * const rating = await prisma.rating.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RatingFindUniqueOrThrowArgs>(args: SelectSubset<T, RatingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Rating that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingFindFirstArgs} args - Arguments to find a Rating
     * @example
     * // Get one Rating
     * const rating = await prisma.rating.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RatingFindFirstArgs>(args?: SelectSubset<T, RatingFindFirstArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Rating that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingFindFirstOrThrowArgs} args - Arguments to find a Rating
     * @example
     * // Get one Rating
     * const rating = await prisma.rating.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RatingFindFirstOrThrowArgs>(args?: SelectSubset<T, RatingFindFirstOrThrowArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Ratings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ratings
     * const ratings = await prisma.rating.findMany()
     * 
     * // Get first 10 Ratings
     * const ratings = await prisma.rating.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ratingWithIdOnly = await prisma.rating.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RatingFindManyArgs>(args?: SelectSubset<T, RatingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Rating.
     * @param {RatingCreateArgs} args - Arguments to create a Rating.
     * @example
     * // Create one Rating
     * const Rating = await prisma.rating.create({
     *   data: {
     *     // ... data to create a Rating
     *   }
     * })
     * 
     */
    create<T extends RatingCreateArgs>(args: SelectSubset<T, RatingCreateArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Ratings.
     * @param {RatingCreateManyArgs} args - Arguments to create many Ratings.
     * @example
     * // Create many Ratings
     * const rating = await prisma.rating.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RatingCreateManyArgs>(args?: SelectSubset<T, RatingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ratings and returns the data saved in the database.
     * @param {RatingCreateManyAndReturnArgs} args - Arguments to create many Ratings.
     * @example
     * // Create many Ratings
     * const rating = await prisma.rating.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ratings and only return the `id`
     * const ratingWithIdOnly = await prisma.rating.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RatingCreateManyAndReturnArgs>(args?: SelectSubset<T, RatingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Rating.
     * @param {RatingDeleteArgs} args - Arguments to delete one Rating.
     * @example
     * // Delete one Rating
     * const Rating = await prisma.rating.delete({
     *   where: {
     *     // ... filter to delete one Rating
     *   }
     * })
     * 
     */
    delete<T extends RatingDeleteArgs>(args: SelectSubset<T, RatingDeleteArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Rating.
     * @param {RatingUpdateArgs} args - Arguments to update one Rating.
     * @example
     * // Update one Rating
     * const rating = await prisma.rating.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RatingUpdateArgs>(args: SelectSubset<T, RatingUpdateArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Ratings.
     * @param {RatingDeleteManyArgs} args - Arguments to filter Ratings to delete.
     * @example
     * // Delete a few Ratings
     * const { count } = await prisma.rating.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RatingDeleteManyArgs>(args?: SelectSubset<T, RatingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ratings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ratings
     * const rating = await prisma.rating.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RatingUpdateManyArgs>(args: SelectSubset<T, RatingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Rating.
     * @param {RatingUpsertArgs} args - Arguments to update or create a Rating.
     * @example
     * // Update or create a Rating
     * const rating = await prisma.rating.upsert({
     *   create: {
     *     // ... data to create a Rating
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Rating we want to update
     *   }
     * })
     */
    upsert<T extends RatingUpsertArgs>(args: SelectSubset<T, RatingUpsertArgs<ExtArgs>>): Prisma__RatingClient<$Result.GetResult<Prisma.$RatingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Ratings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingCountArgs} args - Arguments to filter Ratings to count.
     * @example
     * // Count the number of Ratings
     * const count = await prisma.rating.count({
     *   where: {
     *     // ... the filter for the Ratings we want to count
     *   }
     * })
    **/
    count<T extends RatingCountArgs>(
      args?: Subset<T, RatingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RatingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Rating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RatingAggregateArgs>(args: Subset<T, RatingAggregateArgs>): Prisma.PrismaPromise<GetRatingAggregateType<T>>

    /**
     * Group by Rating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingGroupByArgs} args - Group by arguments.
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
      T extends RatingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RatingGroupByArgs['orderBy'] }
        : { orderBy?: RatingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RatingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRatingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Rating model
   */
  readonly fields: RatingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Rating.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RatingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    submission<T extends SurveySubmissionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SurveySubmissionDefaultArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    location<T extends LocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocationDefaultArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the Rating model
   */ 
  interface RatingFieldRefs {
    readonly id: FieldRef<"Rating", 'Int'>
    readonly submissionId: FieldRef<"Rating", 'String'>
    readonly locationId: FieldRef<"Rating", 'Int'>
    readonly reception: FieldRef<"Rating", 'String'>
    readonly professionalism: FieldRef<"Rating", 'String'>
    readonly understanding: FieldRef<"Rating", 'String'>
    readonly promptnessCare: FieldRef<"Rating", 'String'>
    readonly promptnessFeedback: FieldRef<"Rating", 'String'>
    readonly overall: FieldRef<"Rating", 'String'>
    readonly admission: FieldRef<"Rating", 'String'>
    readonly nurseProfessionalism: FieldRef<"Rating", 'String'>
    readonly doctorProfessionalism: FieldRef<"Rating", 'String'>
    readonly discharge: FieldRef<"Rating", 'String'>
    readonly foodQuality: FieldRef<"Rating", 'String'>
    readonly createdAt: FieldRef<"Rating", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Rating findUnique
   */
  export type RatingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter, which Rating to fetch.
     */
    where: RatingWhereUniqueInput
  }

  /**
   * Rating findUniqueOrThrow
   */
  export type RatingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter, which Rating to fetch.
     */
    where: RatingWhereUniqueInput
  }

  /**
   * Rating findFirst
   */
  export type RatingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter, which Rating to fetch.
     */
    where?: RatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ratings to fetch.
     */
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ratings.
     */
    cursor?: RatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ratings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ratings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ratings.
     */
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[]
  }

  /**
   * Rating findFirstOrThrow
   */
  export type RatingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter, which Rating to fetch.
     */
    where?: RatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ratings to fetch.
     */
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ratings.
     */
    cursor?: RatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ratings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ratings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ratings.
     */
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[]
  }

  /**
   * Rating findMany
   */
  export type RatingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter, which Ratings to fetch.
     */
    where?: RatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ratings to fetch.
     */
    orderBy?: RatingOrderByWithRelationInput | RatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ratings.
     */
    cursor?: RatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ratings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ratings.
     */
    skip?: number
    distinct?: RatingScalarFieldEnum | RatingScalarFieldEnum[]
  }

  /**
   * Rating create
   */
  export type RatingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * The data needed to create a Rating.
     */
    data: XOR<RatingCreateInput, RatingUncheckedCreateInput>
  }

  /**
   * Rating createMany
   */
  export type RatingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ratings.
     */
    data: RatingCreateManyInput | RatingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rating createManyAndReturn
   */
  export type RatingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Ratings.
     */
    data: RatingCreateManyInput | RatingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Rating update
   */
  export type RatingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * The data needed to update a Rating.
     */
    data: XOR<RatingUpdateInput, RatingUncheckedUpdateInput>
    /**
     * Choose, which Rating to update.
     */
    where: RatingWhereUniqueInput
  }

  /**
   * Rating updateMany
   */
  export type RatingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ratings.
     */
    data: XOR<RatingUpdateManyMutationInput, RatingUncheckedUpdateManyInput>
    /**
     * Filter which Ratings to update
     */
    where?: RatingWhereInput
  }

  /**
   * Rating upsert
   */
  export type RatingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * The filter to search for the Rating to update in case it exists.
     */
    where: RatingWhereUniqueInput
    /**
     * In case the Rating found by the `where` argument doesn't exist, create a new Rating with this data.
     */
    create: XOR<RatingCreateInput, RatingUncheckedCreateInput>
    /**
     * In case the Rating was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RatingUpdateInput, RatingUncheckedUpdateInput>
  }

  /**
   * Rating delete
   */
  export type RatingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
    /**
     * Filter which Rating to delete.
     */
    where: RatingWhereUniqueInput
  }

  /**
   * Rating deleteMany
   */
  export type RatingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ratings to delete
     */
    where?: RatingWhereInput
  }

  /**
   * Rating without action
   */
  export type RatingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rating
     */
    select?: RatingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingInclude<ExtArgs> | null
  }


  /**
   * Model GeneralObservation
   */

  export type AggregateGeneralObservation = {
    _count: GeneralObservationCountAggregateOutputType | null
    _avg: GeneralObservationAvgAggregateOutputType | null
    _sum: GeneralObservationSumAggregateOutputType | null
    _min: GeneralObservationMinAggregateOutputType | null
    _max: GeneralObservationMaxAggregateOutputType | null
  }

  export type GeneralObservationAvgAggregateOutputType = {
    id: number | null
  }

  export type GeneralObservationSumAggregateOutputType = {
    id: number | null
  }

  export type GeneralObservationMinAggregateOutputType = {
    id: number | null
    submissionId: string | null
    cleanliness: string | null
    facilities: string | null
    security: string | null
    overall: string | null
    createdAt: Date | null
  }

  export type GeneralObservationMaxAggregateOutputType = {
    id: number | null
    submissionId: string | null
    cleanliness: string | null
    facilities: string | null
    security: string | null
    overall: string | null
    createdAt: Date | null
  }

  export type GeneralObservationCountAggregateOutputType = {
    id: number
    submissionId: number
    cleanliness: number
    facilities: number
    security: number
    overall: number
    createdAt: number
    _all: number
  }


  export type GeneralObservationAvgAggregateInputType = {
    id?: true
  }

  export type GeneralObservationSumAggregateInputType = {
    id?: true
  }

  export type GeneralObservationMinAggregateInputType = {
    id?: true
    submissionId?: true
    cleanliness?: true
    facilities?: true
    security?: true
    overall?: true
    createdAt?: true
  }

  export type GeneralObservationMaxAggregateInputType = {
    id?: true
    submissionId?: true
    cleanliness?: true
    facilities?: true
    security?: true
    overall?: true
    createdAt?: true
  }

  export type GeneralObservationCountAggregateInputType = {
    id?: true
    submissionId?: true
    cleanliness?: true
    facilities?: true
    security?: true
    overall?: true
    createdAt?: true
    _all?: true
  }

  export type GeneralObservationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GeneralObservation to aggregate.
     */
    where?: GeneralObservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeneralObservations to fetch.
     */
    orderBy?: GeneralObservationOrderByWithRelationInput | GeneralObservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GeneralObservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeneralObservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeneralObservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GeneralObservations
    **/
    _count?: true | GeneralObservationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GeneralObservationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GeneralObservationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GeneralObservationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GeneralObservationMaxAggregateInputType
  }

  export type GetGeneralObservationAggregateType<T extends GeneralObservationAggregateArgs> = {
        [P in keyof T & keyof AggregateGeneralObservation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGeneralObservation[P]>
      : GetScalarType<T[P], AggregateGeneralObservation[P]>
  }




  export type GeneralObservationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GeneralObservationWhereInput
    orderBy?: GeneralObservationOrderByWithAggregationInput | GeneralObservationOrderByWithAggregationInput[]
    by: GeneralObservationScalarFieldEnum[] | GeneralObservationScalarFieldEnum
    having?: GeneralObservationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GeneralObservationCountAggregateInputType | true
    _avg?: GeneralObservationAvgAggregateInputType
    _sum?: GeneralObservationSumAggregateInputType
    _min?: GeneralObservationMinAggregateInputType
    _max?: GeneralObservationMaxAggregateInputType
  }

  export type GeneralObservationGroupByOutputType = {
    id: number
    submissionId: string
    cleanliness: string | null
    facilities: string | null
    security: string | null
    overall: string | null
    createdAt: Date
    _count: GeneralObservationCountAggregateOutputType | null
    _avg: GeneralObservationAvgAggregateOutputType | null
    _sum: GeneralObservationSumAggregateOutputType | null
    _min: GeneralObservationMinAggregateOutputType | null
    _max: GeneralObservationMaxAggregateOutputType | null
  }

  type GetGeneralObservationGroupByPayload<T extends GeneralObservationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GeneralObservationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GeneralObservationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GeneralObservationGroupByOutputType[P]>
            : GetScalarType<T[P], GeneralObservationGroupByOutputType[P]>
        }
      >
    >


  export type GeneralObservationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    cleanliness?: boolean
    facilities?: boolean
    security?: boolean
    overall?: boolean
    createdAt?: boolean
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["generalObservation"]>

  export type GeneralObservationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    cleanliness?: boolean
    facilities?: boolean
    security?: boolean
    overall?: boolean
    createdAt?: boolean
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["generalObservation"]>

  export type GeneralObservationSelectScalar = {
    id?: boolean
    submissionId?: boolean
    cleanliness?: boolean
    facilities?: boolean
    security?: boolean
    overall?: boolean
    createdAt?: boolean
  }

  export type GeneralObservationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
  }
  export type GeneralObservationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
  }

  export type $GeneralObservationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GeneralObservation"
    objects: {
      submission: Prisma.$SurveySubmissionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      submissionId: string
      cleanliness: string | null
      facilities: string | null
      security: string | null
      overall: string | null
      createdAt: Date
    }, ExtArgs["result"]["generalObservation"]>
    composites: {}
  }

  type GeneralObservationGetPayload<S extends boolean | null | undefined | GeneralObservationDefaultArgs> = $Result.GetResult<Prisma.$GeneralObservationPayload, S>

  type GeneralObservationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GeneralObservationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GeneralObservationCountAggregateInputType | true
    }

  export interface GeneralObservationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GeneralObservation'], meta: { name: 'GeneralObservation' } }
    /**
     * Find zero or one GeneralObservation that matches the filter.
     * @param {GeneralObservationFindUniqueArgs} args - Arguments to find a GeneralObservation
     * @example
     * // Get one GeneralObservation
     * const generalObservation = await prisma.generalObservation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GeneralObservationFindUniqueArgs>(args: SelectSubset<T, GeneralObservationFindUniqueArgs<ExtArgs>>): Prisma__GeneralObservationClient<$Result.GetResult<Prisma.$GeneralObservationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GeneralObservation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GeneralObservationFindUniqueOrThrowArgs} args - Arguments to find a GeneralObservation
     * @example
     * // Get one GeneralObservation
     * const generalObservation = await prisma.generalObservation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GeneralObservationFindUniqueOrThrowArgs>(args: SelectSubset<T, GeneralObservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GeneralObservationClient<$Result.GetResult<Prisma.$GeneralObservationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GeneralObservation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneralObservationFindFirstArgs} args - Arguments to find a GeneralObservation
     * @example
     * // Get one GeneralObservation
     * const generalObservation = await prisma.generalObservation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GeneralObservationFindFirstArgs>(args?: SelectSubset<T, GeneralObservationFindFirstArgs<ExtArgs>>): Prisma__GeneralObservationClient<$Result.GetResult<Prisma.$GeneralObservationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GeneralObservation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneralObservationFindFirstOrThrowArgs} args - Arguments to find a GeneralObservation
     * @example
     * // Get one GeneralObservation
     * const generalObservation = await prisma.generalObservation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GeneralObservationFindFirstOrThrowArgs>(args?: SelectSubset<T, GeneralObservationFindFirstOrThrowArgs<ExtArgs>>): Prisma__GeneralObservationClient<$Result.GetResult<Prisma.$GeneralObservationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GeneralObservations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneralObservationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GeneralObservations
     * const generalObservations = await prisma.generalObservation.findMany()
     * 
     * // Get first 10 GeneralObservations
     * const generalObservations = await prisma.generalObservation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const generalObservationWithIdOnly = await prisma.generalObservation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GeneralObservationFindManyArgs>(args?: SelectSubset<T, GeneralObservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GeneralObservationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GeneralObservation.
     * @param {GeneralObservationCreateArgs} args - Arguments to create a GeneralObservation.
     * @example
     * // Create one GeneralObservation
     * const GeneralObservation = await prisma.generalObservation.create({
     *   data: {
     *     // ... data to create a GeneralObservation
     *   }
     * })
     * 
     */
    create<T extends GeneralObservationCreateArgs>(args: SelectSubset<T, GeneralObservationCreateArgs<ExtArgs>>): Prisma__GeneralObservationClient<$Result.GetResult<Prisma.$GeneralObservationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GeneralObservations.
     * @param {GeneralObservationCreateManyArgs} args - Arguments to create many GeneralObservations.
     * @example
     * // Create many GeneralObservations
     * const generalObservation = await prisma.generalObservation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GeneralObservationCreateManyArgs>(args?: SelectSubset<T, GeneralObservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GeneralObservations and returns the data saved in the database.
     * @param {GeneralObservationCreateManyAndReturnArgs} args - Arguments to create many GeneralObservations.
     * @example
     * // Create many GeneralObservations
     * const generalObservation = await prisma.generalObservation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GeneralObservations and only return the `id`
     * const generalObservationWithIdOnly = await prisma.generalObservation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GeneralObservationCreateManyAndReturnArgs>(args?: SelectSubset<T, GeneralObservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GeneralObservationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GeneralObservation.
     * @param {GeneralObservationDeleteArgs} args - Arguments to delete one GeneralObservation.
     * @example
     * // Delete one GeneralObservation
     * const GeneralObservation = await prisma.generalObservation.delete({
     *   where: {
     *     // ... filter to delete one GeneralObservation
     *   }
     * })
     * 
     */
    delete<T extends GeneralObservationDeleteArgs>(args: SelectSubset<T, GeneralObservationDeleteArgs<ExtArgs>>): Prisma__GeneralObservationClient<$Result.GetResult<Prisma.$GeneralObservationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GeneralObservation.
     * @param {GeneralObservationUpdateArgs} args - Arguments to update one GeneralObservation.
     * @example
     * // Update one GeneralObservation
     * const generalObservation = await prisma.generalObservation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GeneralObservationUpdateArgs>(args: SelectSubset<T, GeneralObservationUpdateArgs<ExtArgs>>): Prisma__GeneralObservationClient<$Result.GetResult<Prisma.$GeneralObservationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GeneralObservations.
     * @param {GeneralObservationDeleteManyArgs} args - Arguments to filter GeneralObservations to delete.
     * @example
     * // Delete a few GeneralObservations
     * const { count } = await prisma.generalObservation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GeneralObservationDeleteManyArgs>(args?: SelectSubset<T, GeneralObservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GeneralObservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneralObservationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GeneralObservations
     * const generalObservation = await prisma.generalObservation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GeneralObservationUpdateManyArgs>(args: SelectSubset<T, GeneralObservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GeneralObservation.
     * @param {GeneralObservationUpsertArgs} args - Arguments to update or create a GeneralObservation.
     * @example
     * // Update or create a GeneralObservation
     * const generalObservation = await prisma.generalObservation.upsert({
     *   create: {
     *     // ... data to create a GeneralObservation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GeneralObservation we want to update
     *   }
     * })
     */
    upsert<T extends GeneralObservationUpsertArgs>(args: SelectSubset<T, GeneralObservationUpsertArgs<ExtArgs>>): Prisma__GeneralObservationClient<$Result.GetResult<Prisma.$GeneralObservationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GeneralObservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneralObservationCountArgs} args - Arguments to filter GeneralObservations to count.
     * @example
     * // Count the number of GeneralObservations
     * const count = await prisma.generalObservation.count({
     *   where: {
     *     // ... the filter for the GeneralObservations we want to count
     *   }
     * })
    **/
    count<T extends GeneralObservationCountArgs>(
      args?: Subset<T, GeneralObservationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GeneralObservationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GeneralObservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneralObservationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GeneralObservationAggregateArgs>(args: Subset<T, GeneralObservationAggregateArgs>): Prisma.PrismaPromise<GetGeneralObservationAggregateType<T>>

    /**
     * Group by GeneralObservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneralObservationGroupByArgs} args - Group by arguments.
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
      T extends GeneralObservationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GeneralObservationGroupByArgs['orderBy'] }
        : { orderBy?: GeneralObservationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GeneralObservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGeneralObservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GeneralObservation model
   */
  readonly fields: GeneralObservationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GeneralObservation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GeneralObservationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    submission<T extends SurveySubmissionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SurveySubmissionDefaultArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the GeneralObservation model
   */ 
  interface GeneralObservationFieldRefs {
    readonly id: FieldRef<"GeneralObservation", 'Int'>
    readonly submissionId: FieldRef<"GeneralObservation", 'String'>
    readonly cleanliness: FieldRef<"GeneralObservation", 'String'>
    readonly facilities: FieldRef<"GeneralObservation", 'String'>
    readonly security: FieldRef<"GeneralObservation", 'String'>
    readonly overall: FieldRef<"GeneralObservation", 'String'>
    readonly createdAt: FieldRef<"GeneralObservation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GeneralObservation findUnique
   */
  export type GeneralObservationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneralObservation
     */
    select?: GeneralObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneralObservationInclude<ExtArgs> | null
    /**
     * Filter, which GeneralObservation to fetch.
     */
    where: GeneralObservationWhereUniqueInput
  }

  /**
   * GeneralObservation findUniqueOrThrow
   */
  export type GeneralObservationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneralObservation
     */
    select?: GeneralObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneralObservationInclude<ExtArgs> | null
    /**
     * Filter, which GeneralObservation to fetch.
     */
    where: GeneralObservationWhereUniqueInput
  }

  /**
   * GeneralObservation findFirst
   */
  export type GeneralObservationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneralObservation
     */
    select?: GeneralObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneralObservationInclude<ExtArgs> | null
    /**
     * Filter, which GeneralObservation to fetch.
     */
    where?: GeneralObservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeneralObservations to fetch.
     */
    orderBy?: GeneralObservationOrderByWithRelationInput | GeneralObservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GeneralObservations.
     */
    cursor?: GeneralObservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeneralObservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeneralObservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GeneralObservations.
     */
    distinct?: GeneralObservationScalarFieldEnum | GeneralObservationScalarFieldEnum[]
  }

  /**
   * GeneralObservation findFirstOrThrow
   */
  export type GeneralObservationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneralObservation
     */
    select?: GeneralObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneralObservationInclude<ExtArgs> | null
    /**
     * Filter, which GeneralObservation to fetch.
     */
    where?: GeneralObservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeneralObservations to fetch.
     */
    orderBy?: GeneralObservationOrderByWithRelationInput | GeneralObservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GeneralObservations.
     */
    cursor?: GeneralObservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeneralObservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeneralObservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GeneralObservations.
     */
    distinct?: GeneralObservationScalarFieldEnum | GeneralObservationScalarFieldEnum[]
  }

  /**
   * GeneralObservation findMany
   */
  export type GeneralObservationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneralObservation
     */
    select?: GeneralObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneralObservationInclude<ExtArgs> | null
    /**
     * Filter, which GeneralObservations to fetch.
     */
    where?: GeneralObservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeneralObservations to fetch.
     */
    orderBy?: GeneralObservationOrderByWithRelationInput | GeneralObservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GeneralObservations.
     */
    cursor?: GeneralObservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeneralObservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeneralObservations.
     */
    skip?: number
    distinct?: GeneralObservationScalarFieldEnum | GeneralObservationScalarFieldEnum[]
  }

  /**
   * GeneralObservation create
   */
  export type GeneralObservationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneralObservation
     */
    select?: GeneralObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneralObservationInclude<ExtArgs> | null
    /**
     * The data needed to create a GeneralObservation.
     */
    data: XOR<GeneralObservationCreateInput, GeneralObservationUncheckedCreateInput>
  }

  /**
   * GeneralObservation createMany
   */
  export type GeneralObservationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GeneralObservations.
     */
    data: GeneralObservationCreateManyInput | GeneralObservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GeneralObservation createManyAndReturn
   */
  export type GeneralObservationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneralObservation
     */
    select?: GeneralObservationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GeneralObservations.
     */
    data: GeneralObservationCreateManyInput | GeneralObservationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneralObservationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GeneralObservation update
   */
  export type GeneralObservationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneralObservation
     */
    select?: GeneralObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneralObservationInclude<ExtArgs> | null
    /**
     * The data needed to update a GeneralObservation.
     */
    data: XOR<GeneralObservationUpdateInput, GeneralObservationUncheckedUpdateInput>
    /**
     * Choose, which GeneralObservation to update.
     */
    where: GeneralObservationWhereUniqueInput
  }

  /**
   * GeneralObservation updateMany
   */
  export type GeneralObservationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GeneralObservations.
     */
    data: XOR<GeneralObservationUpdateManyMutationInput, GeneralObservationUncheckedUpdateManyInput>
    /**
     * Filter which GeneralObservations to update
     */
    where?: GeneralObservationWhereInput
  }

  /**
   * GeneralObservation upsert
   */
  export type GeneralObservationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneralObservation
     */
    select?: GeneralObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneralObservationInclude<ExtArgs> | null
    /**
     * The filter to search for the GeneralObservation to update in case it exists.
     */
    where: GeneralObservationWhereUniqueInput
    /**
     * In case the GeneralObservation found by the `where` argument doesn't exist, create a new GeneralObservation with this data.
     */
    create: XOR<GeneralObservationCreateInput, GeneralObservationUncheckedCreateInput>
    /**
     * In case the GeneralObservation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GeneralObservationUpdateInput, GeneralObservationUncheckedUpdateInput>
  }

  /**
   * GeneralObservation delete
   */
  export type GeneralObservationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneralObservation
     */
    select?: GeneralObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneralObservationInclude<ExtArgs> | null
    /**
     * Filter which GeneralObservation to delete.
     */
    where: GeneralObservationWhereUniqueInput
  }

  /**
   * GeneralObservation deleteMany
   */
  export type GeneralObservationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GeneralObservations to delete
     */
    where?: GeneralObservationWhereInput
  }

  /**
   * GeneralObservation without action
   */
  export type GeneralObservationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneralObservation
     */
    select?: GeneralObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneralObservationInclude<ExtArgs> | null
  }


  /**
   * Model DepartmentConcern
   */

  export type AggregateDepartmentConcern = {
    _count: DepartmentConcernCountAggregateOutputType | null
    _avg: DepartmentConcernAvgAggregateOutputType | null
    _sum: DepartmentConcernSumAggregateOutputType | null
    _min: DepartmentConcernMinAggregateOutputType | null
    _max: DepartmentConcernMaxAggregateOutputType | null
  }

  export type DepartmentConcernAvgAggregateOutputType = {
    id: number | null
    locationId: number | null
  }

  export type DepartmentConcernSumAggregateOutputType = {
    id: number | null
    locationId: number | null
  }

  export type DepartmentConcernMinAggregateOutputType = {
    id: number | null
    submissionId: string | null
    locationId: number | null
    concern: string | null
    createdAt: Date | null
  }

  export type DepartmentConcernMaxAggregateOutputType = {
    id: number | null
    submissionId: string | null
    locationId: number | null
    concern: string | null
    createdAt: Date | null
  }

  export type DepartmentConcernCountAggregateOutputType = {
    id: number
    submissionId: number
    locationId: number
    concern: number
    createdAt: number
    _all: number
  }


  export type DepartmentConcernAvgAggregateInputType = {
    id?: true
    locationId?: true
  }

  export type DepartmentConcernSumAggregateInputType = {
    id?: true
    locationId?: true
  }

  export type DepartmentConcernMinAggregateInputType = {
    id?: true
    submissionId?: true
    locationId?: true
    concern?: true
    createdAt?: true
  }

  export type DepartmentConcernMaxAggregateInputType = {
    id?: true
    submissionId?: true
    locationId?: true
    concern?: true
    createdAt?: true
  }

  export type DepartmentConcernCountAggregateInputType = {
    id?: true
    submissionId?: true
    locationId?: true
    concern?: true
    createdAt?: true
    _all?: true
  }

  export type DepartmentConcernAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DepartmentConcern to aggregate.
     */
    where?: DepartmentConcernWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentConcerns to fetch.
     */
    orderBy?: DepartmentConcernOrderByWithRelationInput | DepartmentConcernOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DepartmentConcernWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentConcerns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentConcerns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DepartmentConcerns
    **/
    _count?: true | DepartmentConcernCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DepartmentConcernAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DepartmentConcernSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepartmentConcernMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepartmentConcernMaxAggregateInputType
  }

  export type GetDepartmentConcernAggregateType<T extends DepartmentConcernAggregateArgs> = {
        [P in keyof T & keyof AggregateDepartmentConcern]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDepartmentConcern[P]>
      : GetScalarType<T[P], AggregateDepartmentConcern[P]>
  }




  export type DepartmentConcernGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentConcernWhereInput
    orderBy?: DepartmentConcernOrderByWithAggregationInput | DepartmentConcernOrderByWithAggregationInput[]
    by: DepartmentConcernScalarFieldEnum[] | DepartmentConcernScalarFieldEnum
    having?: DepartmentConcernScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepartmentConcernCountAggregateInputType | true
    _avg?: DepartmentConcernAvgAggregateInputType
    _sum?: DepartmentConcernSumAggregateInputType
    _min?: DepartmentConcernMinAggregateInputType
    _max?: DepartmentConcernMaxAggregateInputType
  }

  export type DepartmentConcernGroupByOutputType = {
    id: number
    submissionId: string
    locationId: number
    concern: string
    createdAt: Date
    _count: DepartmentConcernCountAggregateOutputType | null
    _avg: DepartmentConcernAvgAggregateOutputType | null
    _sum: DepartmentConcernSumAggregateOutputType | null
    _min: DepartmentConcernMinAggregateOutputType | null
    _max: DepartmentConcernMaxAggregateOutputType | null
  }

  type GetDepartmentConcernGroupByPayload<T extends DepartmentConcernGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepartmentConcernGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepartmentConcernGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepartmentConcernGroupByOutputType[P]>
            : GetScalarType<T[P], DepartmentConcernGroupByOutputType[P]>
        }
      >
    >


  export type DepartmentConcernSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    locationId?: boolean
    concern?: boolean
    createdAt?: boolean
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["departmentConcern"]>

  export type DepartmentConcernSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    submissionId?: boolean
    locationId?: boolean
    concern?: boolean
    createdAt?: boolean
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["departmentConcern"]>

  export type DepartmentConcernSelectScalar = {
    id?: boolean
    submissionId?: boolean
    locationId?: boolean
    concern?: boolean
    createdAt?: boolean
  }

  export type DepartmentConcernInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }
  export type DepartmentConcernIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submission?: boolean | SurveySubmissionDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }

  export type $DepartmentConcernPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DepartmentConcern"
    objects: {
      submission: Prisma.$SurveySubmissionPayload<ExtArgs>
      location: Prisma.$LocationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      submissionId: string
      locationId: number
      concern: string
      createdAt: Date
    }, ExtArgs["result"]["departmentConcern"]>
    composites: {}
  }

  type DepartmentConcernGetPayload<S extends boolean | null | undefined | DepartmentConcernDefaultArgs> = $Result.GetResult<Prisma.$DepartmentConcernPayload, S>

  type DepartmentConcernCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DepartmentConcernFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DepartmentConcernCountAggregateInputType | true
    }

  export interface DepartmentConcernDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DepartmentConcern'], meta: { name: 'DepartmentConcern' } }
    /**
     * Find zero or one DepartmentConcern that matches the filter.
     * @param {DepartmentConcernFindUniqueArgs} args - Arguments to find a DepartmentConcern
     * @example
     * // Get one DepartmentConcern
     * const departmentConcern = await prisma.departmentConcern.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DepartmentConcernFindUniqueArgs>(args: SelectSubset<T, DepartmentConcernFindUniqueArgs<ExtArgs>>): Prisma__DepartmentConcernClient<$Result.GetResult<Prisma.$DepartmentConcernPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DepartmentConcern that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DepartmentConcernFindUniqueOrThrowArgs} args - Arguments to find a DepartmentConcern
     * @example
     * // Get one DepartmentConcern
     * const departmentConcern = await prisma.departmentConcern.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DepartmentConcernFindUniqueOrThrowArgs>(args: SelectSubset<T, DepartmentConcernFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DepartmentConcernClient<$Result.GetResult<Prisma.$DepartmentConcernPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DepartmentConcern that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentConcernFindFirstArgs} args - Arguments to find a DepartmentConcern
     * @example
     * // Get one DepartmentConcern
     * const departmentConcern = await prisma.departmentConcern.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DepartmentConcernFindFirstArgs>(args?: SelectSubset<T, DepartmentConcernFindFirstArgs<ExtArgs>>): Prisma__DepartmentConcernClient<$Result.GetResult<Prisma.$DepartmentConcernPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DepartmentConcern that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentConcernFindFirstOrThrowArgs} args - Arguments to find a DepartmentConcern
     * @example
     * // Get one DepartmentConcern
     * const departmentConcern = await prisma.departmentConcern.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DepartmentConcernFindFirstOrThrowArgs>(args?: SelectSubset<T, DepartmentConcernFindFirstOrThrowArgs<ExtArgs>>): Prisma__DepartmentConcernClient<$Result.GetResult<Prisma.$DepartmentConcernPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DepartmentConcerns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentConcernFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DepartmentConcerns
     * const departmentConcerns = await prisma.departmentConcern.findMany()
     * 
     * // Get first 10 DepartmentConcerns
     * const departmentConcerns = await prisma.departmentConcern.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const departmentConcernWithIdOnly = await prisma.departmentConcern.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DepartmentConcernFindManyArgs>(args?: SelectSubset<T, DepartmentConcernFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentConcernPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DepartmentConcern.
     * @param {DepartmentConcernCreateArgs} args - Arguments to create a DepartmentConcern.
     * @example
     * // Create one DepartmentConcern
     * const DepartmentConcern = await prisma.departmentConcern.create({
     *   data: {
     *     // ... data to create a DepartmentConcern
     *   }
     * })
     * 
     */
    create<T extends DepartmentConcernCreateArgs>(args: SelectSubset<T, DepartmentConcernCreateArgs<ExtArgs>>): Prisma__DepartmentConcernClient<$Result.GetResult<Prisma.$DepartmentConcernPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DepartmentConcerns.
     * @param {DepartmentConcernCreateManyArgs} args - Arguments to create many DepartmentConcerns.
     * @example
     * // Create many DepartmentConcerns
     * const departmentConcern = await prisma.departmentConcern.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DepartmentConcernCreateManyArgs>(args?: SelectSubset<T, DepartmentConcernCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DepartmentConcerns and returns the data saved in the database.
     * @param {DepartmentConcernCreateManyAndReturnArgs} args - Arguments to create many DepartmentConcerns.
     * @example
     * // Create many DepartmentConcerns
     * const departmentConcern = await prisma.departmentConcern.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DepartmentConcerns and only return the `id`
     * const departmentConcernWithIdOnly = await prisma.departmentConcern.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DepartmentConcernCreateManyAndReturnArgs>(args?: SelectSubset<T, DepartmentConcernCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentConcernPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DepartmentConcern.
     * @param {DepartmentConcernDeleteArgs} args - Arguments to delete one DepartmentConcern.
     * @example
     * // Delete one DepartmentConcern
     * const DepartmentConcern = await prisma.departmentConcern.delete({
     *   where: {
     *     // ... filter to delete one DepartmentConcern
     *   }
     * })
     * 
     */
    delete<T extends DepartmentConcernDeleteArgs>(args: SelectSubset<T, DepartmentConcernDeleteArgs<ExtArgs>>): Prisma__DepartmentConcernClient<$Result.GetResult<Prisma.$DepartmentConcernPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DepartmentConcern.
     * @param {DepartmentConcernUpdateArgs} args - Arguments to update one DepartmentConcern.
     * @example
     * // Update one DepartmentConcern
     * const departmentConcern = await prisma.departmentConcern.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DepartmentConcernUpdateArgs>(args: SelectSubset<T, DepartmentConcernUpdateArgs<ExtArgs>>): Prisma__DepartmentConcernClient<$Result.GetResult<Prisma.$DepartmentConcernPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DepartmentConcerns.
     * @param {DepartmentConcernDeleteManyArgs} args - Arguments to filter DepartmentConcerns to delete.
     * @example
     * // Delete a few DepartmentConcerns
     * const { count } = await prisma.departmentConcern.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DepartmentConcernDeleteManyArgs>(args?: SelectSubset<T, DepartmentConcernDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DepartmentConcerns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentConcernUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DepartmentConcerns
     * const departmentConcern = await prisma.departmentConcern.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DepartmentConcernUpdateManyArgs>(args: SelectSubset<T, DepartmentConcernUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DepartmentConcern.
     * @param {DepartmentConcernUpsertArgs} args - Arguments to update or create a DepartmentConcern.
     * @example
     * // Update or create a DepartmentConcern
     * const departmentConcern = await prisma.departmentConcern.upsert({
     *   create: {
     *     // ... data to create a DepartmentConcern
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DepartmentConcern we want to update
     *   }
     * })
     */
    upsert<T extends DepartmentConcernUpsertArgs>(args: SelectSubset<T, DepartmentConcernUpsertArgs<ExtArgs>>): Prisma__DepartmentConcernClient<$Result.GetResult<Prisma.$DepartmentConcernPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DepartmentConcerns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentConcernCountArgs} args - Arguments to filter DepartmentConcerns to count.
     * @example
     * // Count the number of DepartmentConcerns
     * const count = await prisma.departmentConcern.count({
     *   where: {
     *     // ... the filter for the DepartmentConcerns we want to count
     *   }
     * })
    **/
    count<T extends DepartmentConcernCountArgs>(
      args?: Subset<T, DepartmentConcernCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepartmentConcernCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DepartmentConcern.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentConcernAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DepartmentConcernAggregateArgs>(args: Subset<T, DepartmentConcernAggregateArgs>): Prisma.PrismaPromise<GetDepartmentConcernAggregateType<T>>

    /**
     * Group by DepartmentConcern.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentConcernGroupByArgs} args - Group by arguments.
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
      T extends DepartmentConcernGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DepartmentConcernGroupByArgs['orderBy'] }
        : { orderBy?: DepartmentConcernGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DepartmentConcernGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepartmentConcernGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DepartmentConcern model
   */
  readonly fields: DepartmentConcernFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DepartmentConcern.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DepartmentConcernClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    submission<T extends SurveySubmissionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SurveySubmissionDefaultArgs<ExtArgs>>): Prisma__SurveySubmissionClient<$Result.GetResult<Prisma.$SurveySubmissionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    location<T extends LocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocationDefaultArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the DepartmentConcern model
   */ 
  interface DepartmentConcernFieldRefs {
    readonly id: FieldRef<"DepartmentConcern", 'Int'>
    readonly submissionId: FieldRef<"DepartmentConcern", 'String'>
    readonly locationId: FieldRef<"DepartmentConcern", 'Int'>
    readonly concern: FieldRef<"DepartmentConcern", 'String'>
    readonly createdAt: FieldRef<"DepartmentConcern", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DepartmentConcern findUnique
   */
  export type DepartmentConcernFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentConcern
     */
    select?: DepartmentConcernSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentConcernInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentConcern to fetch.
     */
    where: DepartmentConcernWhereUniqueInput
  }

  /**
   * DepartmentConcern findUniqueOrThrow
   */
  export type DepartmentConcernFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentConcern
     */
    select?: DepartmentConcernSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentConcernInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentConcern to fetch.
     */
    where: DepartmentConcernWhereUniqueInput
  }

  /**
   * DepartmentConcern findFirst
   */
  export type DepartmentConcernFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentConcern
     */
    select?: DepartmentConcernSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentConcernInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentConcern to fetch.
     */
    where?: DepartmentConcernWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentConcerns to fetch.
     */
    orderBy?: DepartmentConcernOrderByWithRelationInput | DepartmentConcernOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DepartmentConcerns.
     */
    cursor?: DepartmentConcernWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentConcerns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentConcerns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DepartmentConcerns.
     */
    distinct?: DepartmentConcernScalarFieldEnum | DepartmentConcernScalarFieldEnum[]
  }

  /**
   * DepartmentConcern findFirstOrThrow
   */
  export type DepartmentConcernFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentConcern
     */
    select?: DepartmentConcernSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentConcernInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentConcern to fetch.
     */
    where?: DepartmentConcernWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentConcerns to fetch.
     */
    orderBy?: DepartmentConcernOrderByWithRelationInput | DepartmentConcernOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DepartmentConcerns.
     */
    cursor?: DepartmentConcernWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentConcerns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentConcerns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DepartmentConcerns.
     */
    distinct?: DepartmentConcernScalarFieldEnum | DepartmentConcernScalarFieldEnum[]
  }

  /**
   * DepartmentConcern findMany
   */
  export type DepartmentConcernFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentConcern
     */
    select?: DepartmentConcernSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentConcernInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentConcerns to fetch.
     */
    where?: DepartmentConcernWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentConcerns to fetch.
     */
    orderBy?: DepartmentConcernOrderByWithRelationInput | DepartmentConcernOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DepartmentConcerns.
     */
    cursor?: DepartmentConcernWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentConcerns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentConcerns.
     */
    skip?: number
    distinct?: DepartmentConcernScalarFieldEnum | DepartmentConcernScalarFieldEnum[]
  }

  /**
   * DepartmentConcern create
   */
  export type DepartmentConcernCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentConcern
     */
    select?: DepartmentConcernSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentConcernInclude<ExtArgs> | null
    /**
     * The data needed to create a DepartmentConcern.
     */
    data: XOR<DepartmentConcernCreateInput, DepartmentConcernUncheckedCreateInput>
  }

  /**
   * DepartmentConcern createMany
   */
  export type DepartmentConcernCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DepartmentConcerns.
     */
    data: DepartmentConcernCreateManyInput | DepartmentConcernCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DepartmentConcern createManyAndReturn
   */
  export type DepartmentConcernCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentConcern
     */
    select?: DepartmentConcernSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DepartmentConcerns.
     */
    data: DepartmentConcernCreateManyInput | DepartmentConcernCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentConcernIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DepartmentConcern update
   */
  export type DepartmentConcernUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentConcern
     */
    select?: DepartmentConcernSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentConcernInclude<ExtArgs> | null
    /**
     * The data needed to update a DepartmentConcern.
     */
    data: XOR<DepartmentConcernUpdateInput, DepartmentConcernUncheckedUpdateInput>
    /**
     * Choose, which DepartmentConcern to update.
     */
    where: DepartmentConcernWhereUniqueInput
  }

  /**
   * DepartmentConcern updateMany
   */
  export type DepartmentConcernUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DepartmentConcerns.
     */
    data: XOR<DepartmentConcernUpdateManyMutationInput, DepartmentConcernUncheckedUpdateManyInput>
    /**
     * Filter which DepartmentConcerns to update
     */
    where?: DepartmentConcernWhereInput
  }

  /**
   * DepartmentConcern upsert
   */
  export type DepartmentConcernUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentConcern
     */
    select?: DepartmentConcernSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentConcernInclude<ExtArgs> | null
    /**
     * The filter to search for the DepartmentConcern to update in case it exists.
     */
    where: DepartmentConcernWhereUniqueInput
    /**
     * In case the DepartmentConcern found by the `where` argument doesn't exist, create a new DepartmentConcern with this data.
     */
    create: XOR<DepartmentConcernCreateInput, DepartmentConcernUncheckedCreateInput>
    /**
     * In case the DepartmentConcern was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DepartmentConcernUpdateInput, DepartmentConcernUncheckedUpdateInput>
  }

  /**
   * DepartmentConcern delete
   */
  export type DepartmentConcernDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentConcern
     */
    select?: DepartmentConcernSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentConcernInclude<ExtArgs> | null
    /**
     * Filter which DepartmentConcern to delete.
     */
    where: DepartmentConcernWhereUniqueInput
  }

  /**
   * DepartmentConcern deleteMany
   */
  export type DepartmentConcernDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DepartmentConcerns to delete
     */
    where?: DepartmentConcernWhereInput
  }

  /**
   * DepartmentConcern without action
   */
  export type DepartmentConcernDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentConcern
     */
    select?: DepartmentConcernSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentConcernInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SurveySubmissionScalarFieldEnum: {
    id: 'id',
    visitTime: 'visitTime',
    visitPurpose: 'visitPurpose',
    visitedOtherPlaces: 'visitedOtherPlaces',
    wouldRecommend: 'wouldRecommend',
    whyNotRecommend: 'whyNotRecommend',
    recommendation: 'recommendation',
    userType: 'userType',
    patientType: 'patientType',
    submittedAt: 'submittedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SurveySubmissionScalarFieldEnum = (typeof SurveySubmissionScalarFieldEnum)[keyof typeof SurveySubmissionScalarFieldEnum]


  export const LocationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    locationType: 'locationType',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LocationScalarFieldEnum = (typeof LocationScalarFieldEnum)[keyof typeof LocationScalarFieldEnum]


  export const SubmissionLocationScalarFieldEnum: {
    id: 'id',
    submissionId: 'submissionId',
    locationId: 'locationId',
    isPrimary: 'isPrimary',
    createdAt: 'createdAt'
  };

  export type SubmissionLocationScalarFieldEnum = (typeof SubmissionLocationScalarFieldEnum)[keyof typeof SubmissionLocationScalarFieldEnum]


  export const RatingScalarFieldEnum: {
    id: 'id',
    submissionId: 'submissionId',
    locationId: 'locationId',
    reception: 'reception',
    professionalism: 'professionalism',
    understanding: 'understanding',
    promptnessCare: 'promptnessCare',
    promptnessFeedback: 'promptnessFeedback',
    overall: 'overall',
    admission: 'admission',
    nurseProfessionalism: 'nurseProfessionalism',
    doctorProfessionalism: 'doctorProfessionalism',
    discharge: 'discharge',
    foodQuality: 'foodQuality',
    createdAt: 'createdAt'
  };

  export type RatingScalarFieldEnum = (typeof RatingScalarFieldEnum)[keyof typeof RatingScalarFieldEnum]


  export const GeneralObservationScalarFieldEnum: {
    id: 'id',
    submissionId: 'submissionId',
    cleanliness: 'cleanliness',
    facilities: 'facilities',
    security: 'security',
    overall: 'overall',
    createdAt: 'createdAt'
  };

  export type GeneralObservationScalarFieldEnum = (typeof GeneralObservationScalarFieldEnum)[keyof typeof GeneralObservationScalarFieldEnum]


  export const DepartmentConcernScalarFieldEnum: {
    id: 'id',
    submissionId: 'submissionId',
    locationId: 'locationId',
    concern: 'concern',
    createdAt: 'createdAt'
  };

  export type DepartmentConcernScalarFieldEnum = (typeof DepartmentConcernScalarFieldEnum)[keyof typeof DepartmentConcernScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type SurveySubmissionWhereInput = {
    AND?: SurveySubmissionWhereInput | SurveySubmissionWhereInput[]
    OR?: SurveySubmissionWhereInput[]
    NOT?: SurveySubmissionWhereInput | SurveySubmissionWhereInput[]
    id?: StringFilter<"SurveySubmission"> | string
    visitTime?: StringFilter<"SurveySubmission"> | string
    visitPurpose?: StringFilter<"SurveySubmission"> | string
    visitedOtherPlaces?: BoolFilter<"SurveySubmission"> | boolean
    wouldRecommend?: BoolNullableFilter<"SurveySubmission"> | boolean | null
    whyNotRecommend?: StringNullableFilter<"SurveySubmission"> | string | null
    recommendation?: StringNullableFilter<"SurveySubmission"> | string | null
    userType?: StringFilter<"SurveySubmission"> | string
    patientType?: StringFilter<"SurveySubmission"> | string
    submittedAt?: DateTimeFilter<"SurveySubmission"> | Date | string
    createdAt?: DateTimeFilter<"SurveySubmission"> | Date | string
    updatedAt?: DateTimeFilter<"SurveySubmission"> | Date | string
    submissionLocations?: SubmissionLocationListRelationFilter
    ratings?: RatingListRelationFilter
    generalObservations?: XOR<GeneralObservationNullableRelationFilter, GeneralObservationWhereInput> | null
    departmentConcerns?: DepartmentConcernListRelationFilter
  }

  export type SurveySubmissionOrderByWithRelationInput = {
    id?: SortOrder
    visitTime?: SortOrder
    visitPurpose?: SortOrder
    visitedOtherPlaces?: SortOrder
    wouldRecommend?: SortOrderInput | SortOrder
    whyNotRecommend?: SortOrderInput | SortOrder
    recommendation?: SortOrderInput | SortOrder
    userType?: SortOrder
    patientType?: SortOrder
    submittedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    submissionLocations?: SubmissionLocationOrderByRelationAggregateInput
    ratings?: RatingOrderByRelationAggregateInput
    generalObservations?: GeneralObservationOrderByWithRelationInput
    departmentConcerns?: DepartmentConcernOrderByRelationAggregateInput
  }

  export type SurveySubmissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SurveySubmissionWhereInput | SurveySubmissionWhereInput[]
    OR?: SurveySubmissionWhereInput[]
    NOT?: SurveySubmissionWhereInput | SurveySubmissionWhereInput[]
    visitTime?: StringFilter<"SurveySubmission"> | string
    visitPurpose?: StringFilter<"SurveySubmission"> | string
    visitedOtherPlaces?: BoolFilter<"SurveySubmission"> | boolean
    wouldRecommend?: BoolNullableFilter<"SurveySubmission"> | boolean | null
    whyNotRecommend?: StringNullableFilter<"SurveySubmission"> | string | null
    recommendation?: StringNullableFilter<"SurveySubmission"> | string | null
    userType?: StringFilter<"SurveySubmission"> | string
    patientType?: StringFilter<"SurveySubmission"> | string
    submittedAt?: DateTimeFilter<"SurveySubmission"> | Date | string
    createdAt?: DateTimeFilter<"SurveySubmission"> | Date | string
    updatedAt?: DateTimeFilter<"SurveySubmission"> | Date | string
    submissionLocations?: SubmissionLocationListRelationFilter
    ratings?: RatingListRelationFilter
    generalObservations?: XOR<GeneralObservationNullableRelationFilter, GeneralObservationWhereInput> | null
    departmentConcerns?: DepartmentConcernListRelationFilter
  }, "id">

  export type SurveySubmissionOrderByWithAggregationInput = {
    id?: SortOrder
    visitTime?: SortOrder
    visitPurpose?: SortOrder
    visitedOtherPlaces?: SortOrder
    wouldRecommend?: SortOrderInput | SortOrder
    whyNotRecommend?: SortOrderInput | SortOrder
    recommendation?: SortOrderInput | SortOrder
    userType?: SortOrder
    patientType?: SortOrder
    submittedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SurveySubmissionCountOrderByAggregateInput
    _max?: SurveySubmissionMaxOrderByAggregateInput
    _min?: SurveySubmissionMinOrderByAggregateInput
  }

  export type SurveySubmissionScalarWhereWithAggregatesInput = {
    AND?: SurveySubmissionScalarWhereWithAggregatesInput | SurveySubmissionScalarWhereWithAggregatesInput[]
    OR?: SurveySubmissionScalarWhereWithAggregatesInput[]
    NOT?: SurveySubmissionScalarWhereWithAggregatesInput | SurveySubmissionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SurveySubmission"> | string
    visitTime?: StringWithAggregatesFilter<"SurveySubmission"> | string
    visitPurpose?: StringWithAggregatesFilter<"SurveySubmission"> | string
    visitedOtherPlaces?: BoolWithAggregatesFilter<"SurveySubmission"> | boolean
    wouldRecommend?: BoolNullableWithAggregatesFilter<"SurveySubmission"> | boolean | null
    whyNotRecommend?: StringNullableWithAggregatesFilter<"SurveySubmission"> | string | null
    recommendation?: StringNullableWithAggregatesFilter<"SurveySubmission"> | string | null
    userType?: StringWithAggregatesFilter<"SurveySubmission"> | string
    patientType?: StringWithAggregatesFilter<"SurveySubmission"> | string
    submittedAt?: DateTimeWithAggregatesFilter<"SurveySubmission"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"SurveySubmission"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SurveySubmission"> | Date | string
  }

  export type LocationWhereInput = {
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    id?: IntFilter<"Location"> | number
    name?: StringFilter<"Location"> | string
    locationType?: StringFilter<"Location"> | string
    createdAt?: DateTimeFilter<"Location"> | Date | string
    updatedAt?: DateTimeFilter<"Location"> | Date | string
    submissionLocations?: SubmissionLocationListRelationFilter
    ratings?: RatingListRelationFilter
    departmentConcerns?: DepartmentConcernListRelationFilter
  }

  export type LocationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    locationType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    submissionLocations?: SubmissionLocationOrderByRelationAggregateInput
    ratings?: RatingOrderByRelationAggregateInput
    departmentConcerns?: DepartmentConcernOrderByRelationAggregateInput
  }

  export type LocationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    locationType?: StringFilter<"Location"> | string
    createdAt?: DateTimeFilter<"Location"> | Date | string
    updatedAt?: DateTimeFilter<"Location"> | Date | string
    submissionLocations?: SubmissionLocationListRelationFilter
    ratings?: RatingListRelationFilter
    departmentConcerns?: DepartmentConcernListRelationFilter
  }, "id" | "name">

  export type LocationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    locationType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LocationCountOrderByAggregateInput
    _avg?: LocationAvgOrderByAggregateInput
    _max?: LocationMaxOrderByAggregateInput
    _min?: LocationMinOrderByAggregateInput
    _sum?: LocationSumOrderByAggregateInput
  }

  export type LocationScalarWhereWithAggregatesInput = {
    AND?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    OR?: LocationScalarWhereWithAggregatesInput[]
    NOT?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Location"> | number
    name?: StringWithAggregatesFilter<"Location"> | string
    locationType?: StringWithAggregatesFilter<"Location"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Location"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Location"> | Date | string
  }

  export type SubmissionLocationWhereInput = {
    AND?: SubmissionLocationWhereInput | SubmissionLocationWhereInput[]
    OR?: SubmissionLocationWhereInput[]
    NOT?: SubmissionLocationWhereInput | SubmissionLocationWhereInput[]
    id?: IntFilter<"SubmissionLocation"> | number
    submissionId?: StringFilter<"SubmissionLocation"> | string
    locationId?: IntFilter<"SubmissionLocation"> | number
    isPrimary?: BoolFilter<"SubmissionLocation"> | boolean
    createdAt?: DateTimeFilter<"SubmissionLocation"> | Date | string
    submission?: XOR<SurveySubmissionRelationFilter, SurveySubmissionWhereInput>
    location?: XOR<LocationRelationFilter, LocationWhereInput>
  }

  export type SubmissionLocationOrderByWithRelationInput = {
    id?: SortOrder
    submissionId?: SortOrder
    locationId?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
    submission?: SurveySubmissionOrderByWithRelationInput
    location?: LocationOrderByWithRelationInput
  }

  export type SubmissionLocationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: SubmissionLocationWhereInput | SubmissionLocationWhereInput[]
    OR?: SubmissionLocationWhereInput[]
    NOT?: SubmissionLocationWhereInput | SubmissionLocationWhereInput[]
    submissionId?: StringFilter<"SubmissionLocation"> | string
    locationId?: IntFilter<"SubmissionLocation"> | number
    isPrimary?: BoolFilter<"SubmissionLocation"> | boolean
    createdAt?: DateTimeFilter<"SubmissionLocation"> | Date | string
    submission?: XOR<SurveySubmissionRelationFilter, SurveySubmissionWhereInput>
    location?: XOR<LocationRelationFilter, LocationWhereInput>
  }, "id">

  export type SubmissionLocationOrderByWithAggregationInput = {
    id?: SortOrder
    submissionId?: SortOrder
    locationId?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
    _count?: SubmissionLocationCountOrderByAggregateInput
    _avg?: SubmissionLocationAvgOrderByAggregateInput
    _max?: SubmissionLocationMaxOrderByAggregateInput
    _min?: SubmissionLocationMinOrderByAggregateInput
    _sum?: SubmissionLocationSumOrderByAggregateInput
  }

  export type SubmissionLocationScalarWhereWithAggregatesInput = {
    AND?: SubmissionLocationScalarWhereWithAggregatesInput | SubmissionLocationScalarWhereWithAggregatesInput[]
    OR?: SubmissionLocationScalarWhereWithAggregatesInput[]
    NOT?: SubmissionLocationScalarWhereWithAggregatesInput | SubmissionLocationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SubmissionLocation"> | number
    submissionId?: StringWithAggregatesFilter<"SubmissionLocation"> | string
    locationId?: IntWithAggregatesFilter<"SubmissionLocation"> | number
    isPrimary?: BoolWithAggregatesFilter<"SubmissionLocation"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SubmissionLocation"> | Date | string
  }

  export type RatingWhereInput = {
    AND?: RatingWhereInput | RatingWhereInput[]
    OR?: RatingWhereInput[]
    NOT?: RatingWhereInput | RatingWhereInput[]
    id?: IntFilter<"Rating"> | number
    submissionId?: StringFilter<"Rating"> | string
    locationId?: IntFilter<"Rating"> | number
    reception?: StringNullableFilter<"Rating"> | string | null
    professionalism?: StringNullableFilter<"Rating"> | string | null
    understanding?: StringNullableFilter<"Rating"> | string | null
    promptnessCare?: StringNullableFilter<"Rating"> | string | null
    promptnessFeedback?: StringNullableFilter<"Rating"> | string | null
    overall?: StringNullableFilter<"Rating"> | string | null
    admission?: StringNullableFilter<"Rating"> | string | null
    nurseProfessionalism?: StringNullableFilter<"Rating"> | string | null
    doctorProfessionalism?: StringNullableFilter<"Rating"> | string | null
    discharge?: StringNullableFilter<"Rating"> | string | null
    foodQuality?: StringNullableFilter<"Rating"> | string | null
    createdAt?: DateTimeFilter<"Rating"> | Date | string
    submission?: XOR<SurveySubmissionRelationFilter, SurveySubmissionWhereInput>
    location?: XOR<LocationRelationFilter, LocationWhereInput>
  }

  export type RatingOrderByWithRelationInput = {
    id?: SortOrder
    submissionId?: SortOrder
    locationId?: SortOrder
    reception?: SortOrderInput | SortOrder
    professionalism?: SortOrderInput | SortOrder
    understanding?: SortOrderInput | SortOrder
    promptnessCare?: SortOrderInput | SortOrder
    promptnessFeedback?: SortOrderInput | SortOrder
    overall?: SortOrderInput | SortOrder
    admission?: SortOrderInput | SortOrder
    nurseProfessionalism?: SortOrderInput | SortOrder
    doctorProfessionalism?: SortOrderInput | SortOrder
    discharge?: SortOrderInput | SortOrder
    foodQuality?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    submission?: SurveySubmissionOrderByWithRelationInput
    location?: LocationOrderByWithRelationInput
  }

  export type RatingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RatingWhereInput | RatingWhereInput[]
    OR?: RatingWhereInput[]
    NOT?: RatingWhereInput | RatingWhereInput[]
    submissionId?: StringFilter<"Rating"> | string
    locationId?: IntFilter<"Rating"> | number
    reception?: StringNullableFilter<"Rating"> | string | null
    professionalism?: StringNullableFilter<"Rating"> | string | null
    understanding?: StringNullableFilter<"Rating"> | string | null
    promptnessCare?: StringNullableFilter<"Rating"> | string | null
    promptnessFeedback?: StringNullableFilter<"Rating"> | string | null
    overall?: StringNullableFilter<"Rating"> | string | null
    admission?: StringNullableFilter<"Rating"> | string | null
    nurseProfessionalism?: StringNullableFilter<"Rating"> | string | null
    doctorProfessionalism?: StringNullableFilter<"Rating"> | string | null
    discharge?: StringNullableFilter<"Rating"> | string | null
    foodQuality?: StringNullableFilter<"Rating"> | string | null
    createdAt?: DateTimeFilter<"Rating"> | Date | string
    submission?: XOR<SurveySubmissionRelationFilter, SurveySubmissionWhereInput>
    location?: XOR<LocationRelationFilter, LocationWhereInput>
  }, "id">

  export type RatingOrderByWithAggregationInput = {
    id?: SortOrder
    submissionId?: SortOrder
    locationId?: SortOrder
    reception?: SortOrderInput | SortOrder
    professionalism?: SortOrderInput | SortOrder
    understanding?: SortOrderInput | SortOrder
    promptnessCare?: SortOrderInput | SortOrder
    promptnessFeedback?: SortOrderInput | SortOrder
    overall?: SortOrderInput | SortOrder
    admission?: SortOrderInput | SortOrder
    nurseProfessionalism?: SortOrderInput | SortOrder
    doctorProfessionalism?: SortOrderInput | SortOrder
    discharge?: SortOrderInput | SortOrder
    foodQuality?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RatingCountOrderByAggregateInput
    _avg?: RatingAvgOrderByAggregateInput
    _max?: RatingMaxOrderByAggregateInput
    _min?: RatingMinOrderByAggregateInput
    _sum?: RatingSumOrderByAggregateInput
  }

  export type RatingScalarWhereWithAggregatesInput = {
    AND?: RatingScalarWhereWithAggregatesInput | RatingScalarWhereWithAggregatesInput[]
    OR?: RatingScalarWhereWithAggregatesInput[]
    NOT?: RatingScalarWhereWithAggregatesInput | RatingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Rating"> | number
    submissionId?: StringWithAggregatesFilter<"Rating"> | string
    locationId?: IntWithAggregatesFilter<"Rating"> | number
    reception?: StringNullableWithAggregatesFilter<"Rating"> | string | null
    professionalism?: StringNullableWithAggregatesFilter<"Rating"> | string | null
    understanding?: StringNullableWithAggregatesFilter<"Rating"> | string | null
    promptnessCare?: StringNullableWithAggregatesFilter<"Rating"> | string | null
    promptnessFeedback?: StringNullableWithAggregatesFilter<"Rating"> | string | null
    overall?: StringNullableWithAggregatesFilter<"Rating"> | string | null
    admission?: StringNullableWithAggregatesFilter<"Rating"> | string | null
    nurseProfessionalism?: StringNullableWithAggregatesFilter<"Rating"> | string | null
    doctorProfessionalism?: StringNullableWithAggregatesFilter<"Rating"> | string | null
    discharge?: StringNullableWithAggregatesFilter<"Rating"> | string | null
    foodQuality?: StringNullableWithAggregatesFilter<"Rating"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Rating"> | Date | string
  }

  export type GeneralObservationWhereInput = {
    AND?: GeneralObservationWhereInput | GeneralObservationWhereInput[]
    OR?: GeneralObservationWhereInput[]
    NOT?: GeneralObservationWhereInput | GeneralObservationWhereInput[]
    id?: IntFilter<"GeneralObservation"> | number
    submissionId?: StringFilter<"GeneralObservation"> | string
    cleanliness?: StringNullableFilter<"GeneralObservation"> | string | null
    facilities?: StringNullableFilter<"GeneralObservation"> | string | null
    security?: StringNullableFilter<"GeneralObservation"> | string | null
    overall?: StringNullableFilter<"GeneralObservation"> | string | null
    createdAt?: DateTimeFilter<"GeneralObservation"> | Date | string
    submission?: XOR<SurveySubmissionRelationFilter, SurveySubmissionWhereInput>
  }

  export type GeneralObservationOrderByWithRelationInput = {
    id?: SortOrder
    submissionId?: SortOrder
    cleanliness?: SortOrderInput | SortOrder
    facilities?: SortOrderInput | SortOrder
    security?: SortOrderInput | SortOrder
    overall?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    submission?: SurveySubmissionOrderByWithRelationInput
  }

  export type GeneralObservationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    submissionId?: string
    AND?: GeneralObservationWhereInput | GeneralObservationWhereInput[]
    OR?: GeneralObservationWhereInput[]
    NOT?: GeneralObservationWhereInput | GeneralObservationWhereInput[]
    cleanliness?: StringNullableFilter<"GeneralObservation"> | string | null
    facilities?: StringNullableFilter<"GeneralObservation"> | string | null
    security?: StringNullableFilter<"GeneralObservation"> | string | null
    overall?: StringNullableFilter<"GeneralObservation"> | string | null
    createdAt?: DateTimeFilter<"GeneralObservation"> | Date | string
    submission?: XOR<SurveySubmissionRelationFilter, SurveySubmissionWhereInput>
  }, "id" | "submissionId">

  export type GeneralObservationOrderByWithAggregationInput = {
    id?: SortOrder
    submissionId?: SortOrder
    cleanliness?: SortOrderInput | SortOrder
    facilities?: SortOrderInput | SortOrder
    security?: SortOrderInput | SortOrder
    overall?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: GeneralObservationCountOrderByAggregateInput
    _avg?: GeneralObservationAvgOrderByAggregateInput
    _max?: GeneralObservationMaxOrderByAggregateInput
    _min?: GeneralObservationMinOrderByAggregateInput
    _sum?: GeneralObservationSumOrderByAggregateInput
  }

  export type GeneralObservationScalarWhereWithAggregatesInput = {
    AND?: GeneralObservationScalarWhereWithAggregatesInput | GeneralObservationScalarWhereWithAggregatesInput[]
    OR?: GeneralObservationScalarWhereWithAggregatesInput[]
    NOT?: GeneralObservationScalarWhereWithAggregatesInput | GeneralObservationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"GeneralObservation"> | number
    submissionId?: StringWithAggregatesFilter<"GeneralObservation"> | string
    cleanliness?: StringNullableWithAggregatesFilter<"GeneralObservation"> | string | null
    facilities?: StringNullableWithAggregatesFilter<"GeneralObservation"> | string | null
    security?: StringNullableWithAggregatesFilter<"GeneralObservation"> | string | null
    overall?: StringNullableWithAggregatesFilter<"GeneralObservation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"GeneralObservation"> | Date | string
  }

  export type DepartmentConcernWhereInput = {
    AND?: DepartmentConcernWhereInput | DepartmentConcernWhereInput[]
    OR?: DepartmentConcernWhereInput[]
    NOT?: DepartmentConcernWhereInput | DepartmentConcernWhereInput[]
    id?: IntFilter<"DepartmentConcern"> | number
    submissionId?: StringFilter<"DepartmentConcern"> | string
    locationId?: IntFilter<"DepartmentConcern"> | number
    concern?: StringFilter<"DepartmentConcern"> | string
    createdAt?: DateTimeFilter<"DepartmentConcern"> | Date | string
    submission?: XOR<SurveySubmissionRelationFilter, SurveySubmissionWhereInput>
    location?: XOR<LocationRelationFilter, LocationWhereInput>
  }

  export type DepartmentConcernOrderByWithRelationInput = {
    id?: SortOrder
    submissionId?: SortOrder
    locationId?: SortOrder
    concern?: SortOrder
    createdAt?: SortOrder
    submission?: SurveySubmissionOrderByWithRelationInput
    location?: LocationOrderByWithRelationInput
  }

  export type DepartmentConcernWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DepartmentConcernWhereInput | DepartmentConcernWhereInput[]
    OR?: DepartmentConcernWhereInput[]
    NOT?: DepartmentConcernWhereInput | DepartmentConcernWhereInput[]
    submissionId?: StringFilter<"DepartmentConcern"> | string
    locationId?: IntFilter<"DepartmentConcern"> | number
    concern?: StringFilter<"DepartmentConcern"> | string
    createdAt?: DateTimeFilter<"DepartmentConcern"> | Date | string
    submission?: XOR<SurveySubmissionRelationFilter, SurveySubmissionWhereInput>
    location?: XOR<LocationRelationFilter, LocationWhereInput>
  }, "id">

  export type DepartmentConcernOrderByWithAggregationInput = {
    id?: SortOrder
    submissionId?: SortOrder
    locationId?: SortOrder
    concern?: SortOrder
    createdAt?: SortOrder
    _count?: DepartmentConcernCountOrderByAggregateInput
    _avg?: DepartmentConcernAvgOrderByAggregateInput
    _max?: DepartmentConcernMaxOrderByAggregateInput
    _min?: DepartmentConcernMinOrderByAggregateInput
    _sum?: DepartmentConcernSumOrderByAggregateInput
  }

  export type DepartmentConcernScalarWhereWithAggregatesInput = {
    AND?: DepartmentConcernScalarWhereWithAggregatesInput | DepartmentConcernScalarWhereWithAggregatesInput[]
    OR?: DepartmentConcernScalarWhereWithAggregatesInput[]
    NOT?: DepartmentConcernScalarWhereWithAggregatesInput | DepartmentConcernScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DepartmentConcern"> | number
    submissionId?: StringWithAggregatesFilter<"DepartmentConcern"> | string
    locationId?: IntWithAggregatesFilter<"DepartmentConcern"> | number
    concern?: StringWithAggregatesFilter<"DepartmentConcern"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DepartmentConcern"> | Date | string
  }

  export type SurveySubmissionCreateInput = {
    id?: string
    visitTime: string
    visitPurpose: string
    visitedOtherPlaces?: boolean
    wouldRecommend?: boolean | null
    whyNotRecommend?: string | null
    recommendation?: string | null
    userType: string
    patientType: string
    submittedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    submissionLocations?: SubmissionLocationCreateNestedManyWithoutSubmissionInput
    ratings?: RatingCreateNestedManyWithoutSubmissionInput
    generalObservations?: GeneralObservationCreateNestedOneWithoutSubmissionInput
    departmentConcerns?: DepartmentConcernCreateNestedManyWithoutSubmissionInput
  }

  export type SurveySubmissionUncheckedCreateInput = {
    id?: string
    visitTime: string
    visitPurpose: string
    visitedOtherPlaces?: boolean
    wouldRecommend?: boolean | null
    whyNotRecommend?: string | null
    recommendation?: string | null
    userType: string
    patientType: string
    submittedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    submissionLocations?: SubmissionLocationUncheckedCreateNestedManyWithoutSubmissionInput
    ratings?: RatingUncheckedCreateNestedManyWithoutSubmissionInput
    generalObservations?: GeneralObservationUncheckedCreateNestedOneWithoutSubmissionInput
    departmentConcerns?: DepartmentConcernUncheckedCreateNestedManyWithoutSubmissionInput
  }

  export type SurveySubmissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitTime?: StringFieldUpdateOperationsInput | string
    visitPurpose?: StringFieldUpdateOperationsInput | string
    visitedOtherPlaces?: BoolFieldUpdateOperationsInput | boolean
    wouldRecommend?: NullableBoolFieldUpdateOperationsInput | boolean | null
    whyNotRecommend?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    userType?: StringFieldUpdateOperationsInput | string
    patientType?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissionLocations?: SubmissionLocationUpdateManyWithoutSubmissionNestedInput
    ratings?: RatingUpdateManyWithoutSubmissionNestedInput
    generalObservations?: GeneralObservationUpdateOneWithoutSubmissionNestedInput
    departmentConcerns?: DepartmentConcernUpdateManyWithoutSubmissionNestedInput
  }

  export type SurveySubmissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitTime?: StringFieldUpdateOperationsInput | string
    visitPurpose?: StringFieldUpdateOperationsInput | string
    visitedOtherPlaces?: BoolFieldUpdateOperationsInput | boolean
    wouldRecommend?: NullableBoolFieldUpdateOperationsInput | boolean | null
    whyNotRecommend?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    userType?: StringFieldUpdateOperationsInput | string
    patientType?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissionLocations?: SubmissionLocationUncheckedUpdateManyWithoutSubmissionNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutSubmissionNestedInput
    generalObservations?: GeneralObservationUncheckedUpdateOneWithoutSubmissionNestedInput
    departmentConcerns?: DepartmentConcernUncheckedUpdateManyWithoutSubmissionNestedInput
  }

  export type SurveySubmissionCreateManyInput = {
    id?: string
    visitTime: string
    visitPurpose: string
    visitedOtherPlaces?: boolean
    wouldRecommend?: boolean | null
    whyNotRecommend?: string | null
    recommendation?: string | null
    userType: string
    patientType: string
    submittedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SurveySubmissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitTime?: StringFieldUpdateOperationsInput | string
    visitPurpose?: StringFieldUpdateOperationsInput | string
    visitedOtherPlaces?: BoolFieldUpdateOperationsInput | boolean
    wouldRecommend?: NullableBoolFieldUpdateOperationsInput | boolean | null
    whyNotRecommend?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    userType?: StringFieldUpdateOperationsInput | string
    patientType?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SurveySubmissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitTime?: StringFieldUpdateOperationsInput | string
    visitPurpose?: StringFieldUpdateOperationsInput | string
    visitedOtherPlaces?: BoolFieldUpdateOperationsInput | boolean
    wouldRecommend?: NullableBoolFieldUpdateOperationsInput | boolean | null
    whyNotRecommend?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    userType?: StringFieldUpdateOperationsInput | string
    patientType?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationCreateInput = {
    name: string
    locationType: string
    createdAt?: Date | string
    updatedAt?: Date | string
    submissionLocations?: SubmissionLocationCreateNestedManyWithoutLocationInput
    ratings?: RatingCreateNestedManyWithoutLocationInput
    departmentConcerns?: DepartmentConcernCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateInput = {
    id?: number
    name: string
    locationType: string
    createdAt?: Date | string
    updatedAt?: Date | string
    submissionLocations?: SubmissionLocationUncheckedCreateNestedManyWithoutLocationInput
    ratings?: RatingUncheckedCreateNestedManyWithoutLocationInput
    departmentConcerns?: DepartmentConcernUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    locationType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissionLocations?: SubmissionLocationUpdateManyWithoutLocationNestedInput
    ratings?: RatingUpdateManyWithoutLocationNestedInput
    departmentConcerns?: DepartmentConcernUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    locationType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissionLocations?: SubmissionLocationUncheckedUpdateManyWithoutLocationNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutLocationNestedInput
    departmentConcerns?: DepartmentConcernUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type LocationCreateManyInput = {
    id?: number
    name: string
    locationType: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocationUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    locationType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    locationType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionLocationCreateInput = {
    isPrimary?: boolean
    createdAt?: Date | string
    submission: SurveySubmissionCreateNestedOneWithoutSubmissionLocationsInput
    location: LocationCreateNestedOneWithoutSubmissionLocationsInput
  }

  export type SubmissionLocationUncheckedCreateInput = {
    id?: number
    submissionId: string
    locationId: number
    isPrimary?: boolean
    createdAt?: Date | string
  }

  export type SubmissionLocationUpdateInput = {
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submission?: SurveySubmissionUpdateOneRequiredWithoutSubmissionLocationsNestedInput
    location?: LocationUpdateOneRequiredWithoutSubmissionLocationsNestedInput
  }

  export type SubmissionLocationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    submissionId?: StringFieldUpdateOperationsInput | string
    locationId?: IntFieldUpdateOperationsInput | number
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionLocationCreateManyInput = {
    id?: number
    submissionId: string
    locationId: number
    isPrimary?: boolean
    createdAt?: Date | string
  }

  export type SubmissionLocationUpdateManyMutationInput = {
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionLocationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    submissionId?: StringFieldUpdateOperationsInput | string
    locationId?: IntFieldUpdateOperationsInput | number
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingCreateInput = {
    reception?: string | null
    professionalism?: string | null
    understanding?: string | null
    promptnessCare?: string | null
    promptnessFeedback?: string | null
    overall?: string | null
    admission?: string | null
    nurseProfessionalism?: string | null
    doctorProfessionalism?: string | null
    discharge?: string | null
    foodQuality?: string | null
    createdAt?: Date | string
    submission: SurveySubmissionCreateNestedOneWithoutRatingsInput
    location: LocationCreateNestedOneWithoutRatingsInput
  }

  export type RatingUncheckedCreateInput = {
    id?: number
    submissionId: string
    locationId: number
    reception?: string | null
    professionalism?: string | null
    understanding?: string | null
    promptnessCare?: string | null
    promptnessFeedback?: string | null
    overall?: string | null
    admission?: string | null
    nurseProfessionalism?: string | null
    doctorProfessionalism?: string | null
    discharge?: string | null
    foodQuality?: string | null
    createdAt?: Date | string
  }

  export type RatingUpdateInput = {
    reception?: NullableStringFieldUpdateOperationsInput | string | null
    professionalism?: NullableStringFieldUpdateOperationsInput | string | null
    understanding?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessCare?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    admission?: NullableStringFieldUpdateOperationsInput | string | null
    nurseProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    doctorProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    discharge?: NullableStringFieldUpdateOperationsInput | string | null
    foodQuality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submission?: SurveySubmissionUpdateOneRequiredWithoutRatingsNestedInput
    location?: LocationUpdateOneRequiredWithoutRatingsNestedInput
  }

  export type RatingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    submissionId?: StringFieldUpdateOperationsInput | string
    locationId?: IntFieldUpdateOperationsInput | number
    reception?: NullableStringFieldUpdateOperationsInput | string | null
    professionalism?: NullableStringFieldUpdateOperationsInput | string | null
    understanding?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessCare?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    admission?: NullableStringFieldUpdateOperationsInput | string | null
    nurseProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    doctorProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    discharge?: NullableStringFieldUpdateOperationsInput | string | null
    foodQuality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingCreateManyInput = {
    id?: number
    submissionId: string
    locationId: number
    reception?: string | null
    professionalism?: string | null
    understanding?: string | null
    promptnessCare?: string | null
    promptnessFeedback?: string | null
    overall?: string | null
    admission?: string | null
    nurseProfessionalism?: string | null
    doctorProfessionalism?: string | null
    discharge?: string | null
    foodQuality?: string | null
    createdAt?: Date | string
  }

  export type RatingUpdateManyMutationInput = {
    reception?: NullableStringFieldUpdateOperationsInput | string | null
    professionalism?: NullableStringFieldUpdateOperationsInput | string | null
    understanding?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessCare?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    admission?: NullableStringFieldUpdateOperationsInput | string | null
    nurseProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    doctorProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    discharge?: NullableStringFieldUpdateOperationsInput | string | null
    foodQuality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    submissionId?: StringFieldUpdateOperationsInput | string
    locationId?: IntFieldUpdateOperationsInput | number
    reception?: NullableStringFieldUpdateOperationsInput | string | null
    professionalism?: NullableStringFieldUpdateOperationsInput | string | null
    understanding?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessCare?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    admission?: NullableStringFieldUpdateOperationsInput | string | null
    nurseProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    doctorProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    discharge?: NullableStringFieldUpdateOperationsInput | string | null
    foodQuality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeneralObservationCreateInput = {
    cleanliness?: string | null
    facilities?: string | null
    security?: string | null
    overall?: string | null
    createdAt?: Date | string
    submission: SurveySubmissionCreateNestedOneWithoutGeneralObservationsInput
  }

  export type GeneralObservationUncheckedCreateInput = {
    id?: number
    submissionId: string
    cleanliness?: string | null
    facilities?: string | null
    security?: string | null
    overall?: string | null
    createdAt?: Date | string
  }

  export type GeneralObservationUpdateInput = {
    cleanliness?: NullableStringFieldUpdateOperationsInput | string | null
    facilities?: NullableStringFieldUpdateOperationsInput | string | null
    security?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submission?: SurveySubmissionUpdateOneRequiredWithoutGeneralObservationsNestedInput
  }

  export type GeneralObservationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    submissionId?: StringFieldUpdateOperationsInput | string
    cleanliness?: NullableStringFieldUpdateOperationsInput | string | null
    facilities?: NullableStringFieldUpdateOperationsInput | string | null
    security?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeneralObservationCreateManyInput = {
    id?: number
    submissionId: string
    cleanliness?: string | null
    facilities?: string | null
    security?: string | null
    overall?: string | null
    createdAt?: Date | string
  }

  export type GeneralObservationUpdateManyMutationInput = {
    cleanliness?: NullableStringFieldUpdateOperationsInput | string | null
    facilities?: NullableStringFieldUpdateOperationsInput | string | null
    security?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeneralObservationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    submissionId?: StringFieldUpdateOperationsInput | string
    cleanliness?: NullableStringFieldUpdateOperationsInput | string | null
    facilities?: NullableStringFieldUpdateOperationsInput | string | null
    security?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentConcernCreateInput = {
    concern: string
    createdAt?: Date | string
    submission: SurveySubmissionCreateNestedOneWithoutDepartmentConcernsInput
    location: LocationCreateNestedOneWithoutDepartmentConcernsInput
  }

  export type DepartmentConcernUncheckedCreateInput = {
    id?: number
    submissionId: string
    locationId: number
    concern: string
    createdAt?: Date | string
  }

  export type DepartmentConcernUpdateInput = {
    concern?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submission?: SurveySubmissionUpdateOneRequiredWithoutDepartmentConcernsNestedInput
    location?: LocationUpdateOneRequiredWithoutDepartmentConcernsNestedInput
  }

  export type DepartmentConcernUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    submissionId?: StringFieldUpdateOperationsInput | string
    locationId?: IntFieldUpdateOperationsInput | number
    concern?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentConcernCreateManyInput = {
    id?: number
    submissionId: string
    locationId: number
    concern: string
    createdAt?: Date | string
  }

  export type DepartmentConcernUpdateManyMutationInput = {
    concern?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentConcernUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    submissionId?: StringFieldUpdateOperationsInput | string
    locationId?: IntFieldUpdateOperationsInput | number
    concern?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SubmissionLocationListRelationFilter = {
    every?: SubmissionLocationWhereInput
    some?: SubmissionLocationWhereInput
    none?: SubmissionLocationWhereInput
  }

  export type RatingListRelationFilter = {
    every?: RatingWhereInput
    some?: RatingWhereInput
    none?: RatingWhereInput
  }

  export type GeneralObservationNullableRelationFilter = {
    is?: GeneralObservationWhereInput | null
    isNot?: GeneralObservationWhereInput | null
  }

  export type DepartmentConcernListRelationFilter = {
    every?: DepartmentConcernWhereInput
    some?: DepartmentConcernWhereInput
    none?: DepartmentConcernWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SubmissionLocationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RatingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DepartmentConcernOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SurveySubmissionCountOrderByAggregateInput = {
    id?: SortOrder
    visitTime?: SortOrder
    visitPurpose?: SortOrder
    visitedOtherPlaces?: SortOrder
    wouldRecommend?: SortOrder
    whyNotRecommend?: SortOrder
    recommendation?: SortOrder
    userType?: SortOrder
    patientType?: SortOrder
    submittedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SurveySubmissionMaxOrderByAggregateInput = {
    id?: SortOrder
    visitTime?: SortOrder
    visitPurpose?: SortOrder
    visitedOtherPlaces?: SortOrder
    wouldRecommend?: SortOrder
    whyNotRecommend?: SortOrder
    recommendation?: SortOrder
    userType?: SortOrder
    patientType?: SortOrder
    submittedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SurveySubmissionMinOrderByAggregateInput = {
    id?: SortOrder
    visitTime?: SortOrder
    visitPurpose?: SortOrder
    visitedOtherPlaces?: SortOrder
    wouldRecommend?: SortOrder
    whyNotRecommend?: SortOrder
    recommendation?: SortOrder
    userType?: SortOrder
    patientType?: SortOrder
    submittedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type LocationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    locationType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocationAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type LocationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    locationType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    locationType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocationSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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

  export type SurveySubmissionRelationFilter = {
    is?: SurveySubmissionWhereInput
    isNot?: SurveySubmissionWhereInput
  }

  export type LocationRelationFilter = {
    is?: LocationWhereInput
    isNot?: LocationWhereInput
  }

  export type SubmissionLocationCountOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    locationId?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
  }

  export type SubmissionLocationAvgOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
  }

  export type SubmissionLocationMaxOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    locationId?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
  }

  export type SubmissionLocationMinOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    locationId?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
  }

  export type SubmissionLocationSumOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
  }

  export type RatingCountOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    locationId?: SortOrder
    reception?: SortOrder
    professionalism?: SortOrder
    understanding?: SortOrder
    promptnessCare?: SortOrder
    promptnessFeedback?: SortOrder
    overall?: SortOrder
    admission?: SortOrder
    nurseProfessionalism?: SortOrder
    doctorProfessionalism?: SortOrder
    discharge?: SortOrder
    foodQuality?: SortOrder
    createdAt?: SortOrder
  }

  export type RatingAvgOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
  }

  export type RatingMaxOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    locationId?: SortOrder
    reception?: SortOrder
    professionalism?: SortOrder
    understanding?: SortOrder
    promptnessCare?: SortOrder
    promptnessFeedback?: SortOrder
    overall?: SortOrder
    admission?: SortOrder
    nurseProfessionalism?: SortOrder
    doctorProfessionalism?: SortOrder
    discharge?: SortOrder
    foodQuality?: SortOrder
    createdAt?: SortOrder
  }

  export type RatingMinOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    locationId?: SortOrder
    reception?: SortOrder
    professionalism?: SortOrder
    understanding?: SortOrder
    promptnessCare?: SortOrder
    promptnessFeedback?: SortOrder
    overall?: SortOrder
    admission?: SortOrder
    nurseProfessionalism?: SortOrder
    doctorProfessionalism?: SortOrder
    discharge?: SortOrder
    foodQuality?: SortOrder
    createdAt?: SortOrder
  }

  export type RatingSumOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
  }

  export type GeneralObservationCountOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    cleanliness?: SortOrder
    facilities?: SortOrder
    security?: SortOrder
    overall?: SortOrder
    createdAt?: SortOrder
  }

  export type GeneralObservationAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type GeneralObservationMaxOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    cleanliness?: SortOrder
    facilities?: SortOrder
    security?: SortOrder
    overall?: SortOrder
    createdAt?: SortOrder
  }

  export type GeneralObservationMinOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    cleanliness?: SortOrder
    facilities?: SortOrder
    security?: SortOrder
    overall?: SortOrder
    createdAt?: SortOrder
  }

  export type GeneralObservationSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DepartmentConcernCountOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    locationId?: SortOrder
    concern?: SortOrder
    createdAt?: SortOrder
  }

  export type DepartmentConcernAvgOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
  }

  export type DepartmentConcernMaxOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    locationId?: SortOrder
    concern?: SortOrder
    createdAt?: SortOrder
  }

  export type DepartmentConcernMinOrderByAggregateInput = {
    id?: SortOrder
    submissionId?: SortOrder
    locationId?: SortOrder
    concern?: SortOrder
    createdAt?: SortOrder
  }

  export type DepartmentConcernSumOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
  }

  export type SubmissionLocationCreateNestedManyWithoutSubmissionInput = {
    create?: XOR<SubmissionLocationCreateWithoutSubmissionInput, SubmissionLocationUncheckedCreateWithoutSubmissionInput> | SubmissionLocationCreateWithoutSubmissionInput[] | SubmissionLocationUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: SubmissionLocationCreateOrConnectWithoutSubmissionInput | SubmissionLocationCreateOrConnectWithoutSubmissionInput[]
    createMany?: SubmissionLocationCreateManySubmissionInputEnvelope
    connect?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
  }

  export type RatingCreateNestedManyWithoutSubmissionInput = {
    create?: XOR<RatingCreateWithoutSubmissionInput, RatingUncheckedCreateWithoutSubmissionInput> | RatingCreateWithoutSubmissionInput[] | RatingUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutSubmissionInput | RatingCreateOrConnectWithoutSubmissionInput[]
    createMany?: RatingCreateManySubmissionInputEnvelope
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
  }

  export type GeneralObservationCreateNestedOneWithoutSubmissionInput = {
    create?: XOR<GeneralObservationCreateWithoutSubmissionInput, GeneralObservationUncheckedCreateWithoutSubmissionInput>
    connectOrCreate?: GeneralObservationCreateOrConnectWithoutSubmissionInput
    connect?: GeneralObservationWhereUniqueInput
  }

  export type DepartmentConcernCreateNestedManyWithoutSubmissionInput = {
    create?: XOR<DepartmentConcernCreateWithoutSubmissionInput, DepartmentConcernUncheckedCreateWithoutSubmissionInput> | DepartmentConcernCreateWithoutSubmissionInput[] | DepartmentConcernUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: DepartmentConcernCreateOrConnectWithoutSubmissionInput | DepartmentConcernCreateOrConnectWithoutSubmissionInput[]
    createMany?: DepartmentConcernCreateManySubmissionInputEnvelope
    connect?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
  }

  export type SubmissionLocationUncheckedCreateNestedManyWithoutSubmissionInput = {
    create?: XOR<SubmissionLocationCreateWithoutSubmissionInput, SubmissionLocationUncheckedCreateWithoutSubmissionInput> | SubmissionLocationCreateWithoutSubmissionInput[] | SubmissionLocationUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: SubmissionLocationCreateOrConnectWithoutSubmissionInput | SubmissionLocationCreateOrConnectWithoutSubmissionInput[]
    createMany?: SubmissionLocationCreateManySubmissionInputEnvelope
    connect?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
  }

  export type RatingUncheckedCreateNestedManyWithoutSubmissionInput = {
    create?: XOR<RatingCreateWithoutSubmissionInput, RatingUncheckedCreateWithoutSubmissionInput> | RatingCreateWithoutSubmissionInput[] | RatingUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutSubmissionInput | RatingCreateOrConnectWithoutSubmissionInput[]
    createMany?: RatingCreateManySubmissionInputEnvelope
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
  }

  export type GeneralObservationUncheckedCreateNestedOneWithoutSubmissionInput = {
    create?: XOR<GeneralObservationCreateWithoutSubmissionInput, GeneralObservationUncheckedCreateWithoutSubmissionInput>
    connectOrCreate?: GeneralObservationCreateOrConnectWithoutSubmissionInput
    connect?: GeneralObservationWhereUniqueInput
  }

  export type DepartmentConcernUncheckedCreateNestedManyWithoutSubmissionInput = {
    create?: XOR<DepartmentConcernCreateWithoutSubmissionInput, DepartmentConcernUncheckedCreateWithoutSubmissionInput> | DepartmentConcernCreateWithoutSubmissionInput[] | DepartmentConcernUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: DepartmentConcernCreateOrConnectWithoutSubmissionInput | DepartmentConcernCreateOrConnectWithoutSubmissionInput[]
    createMany?: DepartmentConcernCreateManySubmissionInputEnvelope
    connect?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SubmissionLocationUpdateManyWithoutSubmissionNestedInput = {
    create?: XOR<SubmissionLocationCreateWithoutSubmissionInput, SubmissionLocationUncheckedCreateWithoutSubmissionInput> | SubmissionLocationCreateWithoutSubmissionInput[] | SubmissionLocationUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: SubmissionLocationCreateOrConnectWithoutSubmissionInput | SubmissionLocationCreateOrConnectWithoutSubmissionInput[]
    upsert?: SubmissionLocationUpsertWithWhereUniqueWithoutSubmissionInput | SubmissionLocationUpsertWithWhereUniqueWithoutSubmissionInput[]
    createMany?: SubmissionLocationCreateManySubmissionInputEnvelope
    set?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    disconnect?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    delete?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    connect?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    update?: SubmissionLocationUpdateWithWhereUniqueWithoutSubmissionInput | SubmissionLocationUpdateWithWhereUniqueWithoutSubmissionInput[]
    updateMany?: SubmissionLocationUpdateManyWithWhereWithoutSubmissionInput | SubmissionLocationUpdateManyWithWhereWithoutSubmissionInput[]
    deleteMany?: SubmissionLocationScalarWhereInput | SubmissionLocationScalarWhereInput[]
  }

  export type RatingUpdateManyWithoutSubmissionNestedInput = {
    create?: XOR<RatingCreateWithoutSubmissionInput, RatingUncheckedCreateWithoutSubmissionInput> | RatingCreateWithoutSubmissionInput[] | RatingUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutSubmissionInput | RatingCreateOrConnectWithoutSubmissionInput[]
    upsert?: RatingUpsertWithWhereUniqueWithoutSubmissionInput | RatingUpsertWithWhereUniqueWithoutSubmissionInput[]
    createMany?: RatingCreateManySubmissionInputEnvelope
    set?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    disconnect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    delete?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    update?: RatingUpdateWithWhereUniqueWithoutSubmissionInput | RatingUpdateWithWhereUniqueWithoutSubmissionInput[]
    updateMany?: RatingUpdateManyWithWhereWithoutSubmissionInput | RatingUpdateManyWithWhereWithoutSubmissionInput[]
    deleteMany?: RatingScalarWhereInput | RatingScalarWhereInput[]
  }

  export type GeneralObservationUpdateOneWithoutSubmissionNestedInput = {
    create?: XOR<GeneralObservationCreateWithoutSubmissionInput, GeneralObservationUncheckedCreateWithoutSubmissionInput>
    connectOrCreate?: GeneralObservationCreateOrConnectWithoutSubmissionInput
    upsert?: GeneralObservationUpsertWithoutSubmissionInput
    disconnect?: GeneralObservationWhereInput | boolean
    delete?: GeneralObservationWhereInput | boolean
    connect?: GeneralObservationWhereUniqueInput
    update?: XOR<XOR<GeneralObservationUpdateToOneWithWhereWithoutSubmissionInput, GeneralObservationUpdateWithoutSubmissionInput>, GeneralObservationUncheckedUpdateWithoutSubmissionInput>
  }

  export type DepartmentConcernUpdateManyWithoutSubmissionNestedInput = {
    create?: XOR<DepartmentConcernCreateWithoutSubmissionInput, DepartmentConcernUncheckedCreateWithoutSubmissionInput> | DepartmentConcernCreateWithoutSubmissionInput[] | DepartmentConcernUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: DepartmentConcernCreateOrConnectWithoutSubmissionInput | DepartmentConcernCreateOrConnectWithoutSubmissionInput[]
    upsert?: DepartmentConcernUpsertWithWhereUniqueWithoutSubmissionInput | DepartmentConcernUpsertWithWhereUniqueWithoutSubmissionInput[]
    createMany?: DepartmentConcernCreateManySubmissionInputEnvelope
    set?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    disconnect?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    delete?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    connect?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    update?: DepartmentConcernUpdateWithWhereUniqueWithoutSubmissionInput | DepartmentConcernUpdateWithWhereUniqueWithoutSubmissionInput[]
    updateMany?: DepartmentConcernUpdateManyWithWhereWithoutSubmissionInput | DepartmentConcernUpdateManyWithWhereWithoutSubmissionInput[]
    deleteMany?: DepartmentConcernScalarWhereInput | DepartmentConcernScalarWhereInput[]
  }

  export type SubmissionLocationUncheckedUpdateManyWithoutSubmissionNestedInput = {
    create?: XOR<SubmissionLocationCreateWithoutSubmissionInput, SubmissionLocationUncheckedCreateWithoutSubmissionInput> | SubmissionLocationCreateWithoutSubmissionInput[] | SubmissionLocationUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: SubmissionLocationCreateOrConnectWithoutSubmissionInput | SubmissionLocationCreateOrConnectWithoutSubmissionInput[]
    upsert?: SubmissionLocationUpsertWithWhereUniqueWithoutSubmissionInput | SubmissionLocationUpsertWithWhereUniqueWithoutSubmissionInput[]
    createMany?: SubmissionLocationCreateManySubmissionInputEnvelope
    set?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    disconnect?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    delete?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    connect?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    update?: SubmissionLocationUpdateWithWhereUniqueWithoutSubmissionInput | SubmissionLocationUpdateWithWhereUniqueWithoutSubmissionInput[]
    updateMany?: SubmissionLocationUpdateManyWithWhereWithoutSubmissionInput | SubmissionLocationUpdateManyWithWhereWithoutSubmissionInput[]
    deleteMany?: SubmissionLocationScalarWhereInput | SubmissionLocationScalarWhereInput[]
  }

  export type RatingUncheckedUpdateManyWithoutSubmissionNestedInput = {
    create?: XOR<RatingCreateWithoutSubmissionInput, RatingUncheckedCreateWithoutSubmissionInput> | RatingCreateWithoutSubmissionInput[] | RatingUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutSubmissionInput | RatingCreateOrConnectWithoutSubmissionInput[]
    upsert?: RatingUpsertWithWhereUniqueWithoutSubmissionInput | RatingUpsertWithWhereUniqueWithoutSubmissionInput[]
    createMany?: RatingCreateManySubmissionInputEnvelope
    set?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    disconnect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    delete?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    update?: RatingUpdateWithWhereUniqueWithoutSubmissionInput | RatingUpdateWithWhereUniqueWithoutSubmissionInput[]
    updateMany?: RatingUpdateManyWithWhereWithoutSubmissionInput | RatingUpdateManyWithWhereWithoutSubmissionInput[]
    deleteMany?: RatingScalarWhereInput | RatingScalarWhereInput[]
  }

  export type GeneralObservationUncheckedUpdateOneWithoutSubmissionNestedInput = {
    create?: XOR<GeneralObservationCreateWithoutSubmissionInput, GeneralObservationUncheckedCreateWithoutSubmissionInput>
    connectOrCreate?: GeneralObservationCreateOrConnectWithoutSubmissionInput
    upsert?: GeneralObservationUpsertWithoutSubmissionInput
    disconnect?: GeneralObservationWhereInput | boolean
    delete?: GeneralObservationWhereInput | boolean
    connect?: GeneralObservationWhereUniqueInput
    update?: XOR<XOR<GeneralObservationUpdateToOneWithWhereWithoutSubmissionInput, GeneralObservationUpdateWithoutSubmissionInput>, GeneralObservationUncheckedUpdateWithoutSubmissionInput>
  }

  export type DepartmentConcernUncheckedUpdateManyWithoutSubmissionNestedInput = {
    create?: XOR<DepartmentConcernCreateWithoutSubmissionInput, DepartmentConcernUncheckedCreateWithoutSubmissionInput> | DepartmentConcernCreateWithoutSubmissionInput[] | DepartmentConcernUncheckedCreateWithoutSubmissionInput[]
    connectOrCreate?: DepartmentConcernCreateOrConnectWithoutSubmissionInput | DepartmentConcernCreateOrConnectWithoutSubmissionInput[]
    upsert?: DepartmentConcernUpsertWithWhereUniqueWithoutSubmissionInput | DepartmentConcernUpsertWithWhereUniqueWithoutSubmissionInput[]
    createMany?: DepartmentConcernCreateManySubmissionInputEnvelope
    set?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    disconnect?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    delete?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    connect?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    update?: DepartmentConcernUpdateWithWhereUniqueWithoutSubmissionInput | DepartmentConcernUpdateWithWhereUniqueWithoutSubmissionInput[]
    updateMany?: DepartmentConcernUpdateManyWithWhereWithoutSubmissionInput | DepartmentConcernUpdateManyWithWhereWithoutSubmissionInput[]
    deleteMany?: DepartmentConcernScalarWhereInput | DepartmentConcernScalarWhereInput[]
  }

  export type SubmissionLocationCreateNestedManyWithoutLocationInput = {
    create?: XOR<SubmissionLocationCreateWithoutLocationInput, SubmissionLocationUncheckedCreateWithoutLocationInput> | SubmissionLocationCreateWithoutLocationInput[] | SubmissionLocationUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: SubmissionLocationCreateOrConnectWithoutLocationInput | SubmissionLocationCreateOrConnectWithoutLocationInput[]
    createMany?: SubmissionLocationCreateManyLocationInputEnvelope
    connect?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
  }

  export type RatingCreateNestedManyWithoutLocationInput = {
    create?: XOR<RatingCreateWithoutLocationInput, RatingUncheckedCreateWithoutLocationInput> | RatingCreateWithoutLocationInput[] | RatingUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutLocationInput | RatingCreateOrConnectWithoutLocationInput[]
    createMany?: RatingCreateManyLocationInputEnvelope
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
  }

  export type DepartmentConcernCreateNestedManyWithoutLocationInput = {
    create?: XOR<DepartmentConcernCreateWithoutLocationInput, DepartmentConcernUncheckedCreateWithoutLocationInput> | DepartmentConcernCreateWithoutLocationInput[] | DepartmentConcernUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: DepartmentConcernCreateOrConnectWithoutLocationInput | DepartmentConcernCreateOrConnectWithoutLocationInput[]
    createMany?: DepartmentConcernCreateManyLocationInputEnvelope
    connect?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
  }

  export type SubmissionLocationUncheckedCreateNestedManyWithoutLocationInput = {
    create?: XOR<SubmissionLocationCreateWithoutLocationInput, SubmissionLocationUncheckedCreateWithoutLocationInput> | SubmissionLocationCreateWithoutLocationInput[] | SubmissionLocationUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: SubmissionLocationCreateOrConnectWithoutLocationInput | SubmissionLocationCreateOrConnectWithoutLocationInput[]
    createMany?: SubmissionLocationCreateManyLocationInputEnvelope
    connect?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
  }

  export type RatingUncheckedCreateNestedManyWithoutLocationInput = {
    create?: XOR<RatingCreateWithoutLocationInput, RatingUncheckedCreateWithoutLocationInput> | RatingCreateWithoutLocationInput[] | RatingUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutLocationInput | RatingCreateOrConnectWithoutLocationInput[]
    createMany?: RatingCreateManyLocationInputEnvelope
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
  }

  export type DepartmentConcernUncheckedCreateNestedManyWithoutLocationInput = {
    create?: XOR<DepartmentConcernCreateWithoutLocationInput, DepartmentConcernUncheckedCreateWithoutLocationInput> | DepartmentConcernCreateWithoutLocationInput[] | DepartmentConcernUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: DepartmentConcernCreateOrConnectWithoutLocationInput | DepartmentConcernCreateOrConnectWithoutLocationInput[]
    createMany?: DepartmentConcernCreateManyLocationInputEnvelope
    connect?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
  }

  export type SubmissionLocationUpdateManyWithoutLocationNestedInput = {
    create?: XOR<SubmissionLocationCreateWithoutLocationInput, SubmissionLocationUncheckedCreateWithoutLocationInput> | SubmissionLocationCreateWithoutLocationInput[] | SubmissionLocationUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: SubmissionLocationCreateOrConnectWithoutLocationInput | SubmissionLocationCreateOrConnectWithoutLocationInput[]
    upsert?: SubmissionLocationUpsertWithWhereUniqueWithoutLocationInput | SubmissionLocationUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: SubmissionLocationCreateManyLocationInputEnvelope
    set?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    disconnect?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    delete?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    connect?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    update?: SubmissionLocationUpdateWithWhereUniqueWithoutLocationInput | SubmissionLocationUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: SubmissionLocationUpdateManyWithWhereWithoutLocationInput | SubmissionLocationUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: SubmissionLocationScalarWhereInput | SubmissionLocationScalarWhereInput[]
  }

  export type RatingUpdateManyWithoutLocationNestedInput = {
    create?: XOR<RatingCreateWithoutLocationInput, RatingUncheckedCreateWithoutLocationInput> | RatingCreateWithoutLocationInput[] | RatingUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutLocationInput | RatingCreateOrConnectWithoutLocationInput[]
    upsert?: RatingUpsertWithWhereUniqueWithoutLocationInput | RatingUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: RatingCreateManyLocationInputEnvelope
    set?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    disconnect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    delete?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    update?: RatingUpdateWithWhereUniqueWithoutLocationInput | RatingUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: RatingUpdateManyWithWhereWithoutLocationInput | RatingUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: RatingScalarWhereInput | RatingScalarWhereInput[]
  }

  export type DepartmentConcernUpdateManyWithoutLocationNestedInput = {
    create?: XOR<DepartmentConcernCreateWithoutLocationInput, DepartmentConcernUncheckedCreateWithoutLocationInput> | DepartmentConcernCreateWithoutLocationInput[] | DepartmentConcernUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: DepartmentConcernCreateOrConnectWithoutLocationInput | DepartmentConcernCreateOrConnectWithoutLocationInput[]
    upsert?: DepartmentConcernUpsertWithWhereUniqueWithoutLocationInput | DepartmentConcernUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: DepartmentConcernCreateManyLocationInputEnvelope
    set?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    disconnect?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    delete?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    connect?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    update?: DepartmentConcernUpdateWithWhereUniqueWithoutLocationInput | DepartmentConcernUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: DepartmentConcernUpdateManyWithWhereWithoutLocationInput | DepartmentConcernUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: DepartmentConcernScalarWhereInput | DepartmentConcernScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SubmissionLocationUncheckedUpdateManyWithoutLocationNestedInput = {
    create?: XOR<SubmissionLocationCreateWithoutLocationInput, SubmissionLocationUncheckedCreateWithoutLocationInput> | SubmissionLocationCreateWithoutLocationInput[] | SubmissionLocationUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: SubmissionLocationCreateOrConnectWithoutLocationInput | SubmissionLocationCreateOrConnectWithoutLocationInput[]
    upsert?: SubmissionLocationUpsertWithWhereUniqueWithoutLocationInput | SubmissionLocationUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: SubmissionLocationCreateManyLocationInputEnvelope
    set?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    disconnect?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    delete?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    connect?: SubmissionLocationWhereUniqueInput | SubmissionLocationWhereUniqueInput[]
    update?: SubmissionLocationUpdateWithWhereUniqueWithoutLocationInput | SubmissionLocationUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: SubmissionLocationUpdateManyWithWhereWithoutLocationInput | SubmissionLocationUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: SubmissionLocationScalarWhereInput | SubmissionLocationScalarWhereInput[]
  }

  export type RatingUncheckedUpdateManyWithoutLocationNestedInput = {
    create?: XOR<RatingCreateWithoutLocationInput, RatingUncheckedCreateWithoutLocationInput> | RatingCreateWithoutLocationInput[] | RatingUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: RatingCreateOrConnectWithoutLocationInput | RatingCreateOrConnectWithoutLocationInput[]
    upsert?: RatingUpsertWithWhereUniqueWithoutLocationInput | RatingUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: RatingCreateManyLocationInputEnvelope
    set?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    disconnect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    delete?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    connect?: RatingWhereUniqueInput | RatingWhereUniqueInput[]
    update?: RatingUpdateWithWhereUniqueWithoutLocationInput | RatingUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: RatingUpdateManyWithWhereWithoutLocationInput | RatingUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: RatingScalarWhereInput | RatingScalarWhereInput[]
  }

  export type DepartmentConcernUncheckedUpdateManyWithoutLocationNestedInput = {
    create?: XOR<DepartmentConcernCreateWithoutLocationInput, DepartmentConcernUncheckedCreateWithoutLocationInput> | DepartmentConcernCreateWithoutLocationInput[] | DepartmentConcernUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: DepartmentConcernCreateOrConnectWithoutLocationInput | DepartmentConcernCreateOrConnectWithoutLocationInput[]
    upsert?: DepartmentConcernUpsertWithWhereUniqueWithoutLocationInput | DepartmentConcernUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: DepartmentConcernCreateManyLocationInputEnvelope
    set?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    disconnect?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    delete?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    connect?: DepartmentConcernWhereUniqueInput | DepartmentConcernWhereUniqueInput[]
    update?: DepartmentConcernUpdateWithWhereUniqueWithoutLocationInput | DepartmentConcernUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: DepartmentConcernUpdateManyWithWhereWithoutLocationInput | DepartmentConcernUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: DepartmentConcernScalarWhereInput | DepartmentConcernScalarWhereInput[]
  }

  export type SurveySubmissionCreateNestedOneWithoutSubmissionLocationsInput = {
    create?: XOR<SurveySubmissionCreateWithoutSubmissionLocationsInput, SurveySubmissionUncheckedCreateWithoutSubmissionLocationsInput>
    connectOrCreate?: SurveySubmissionCreateOrConnectWithoutSubmissionLocationsInput
    connect?: SurveySubmissionWhereUniqueInput
  }

  export type LocationCreateNestedOneWithoutSubmissionLocationsInput = {
    create?: XOR<LocationCreateWithoutSubmissionLocationsInput, LocationUncheckedCreateWithoutSubmissionLocationsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutSubmissionLocationsInput
    connect?: LocationWhereUniqueInput
  }

  export type SurveySubmissionUpdateOneRequiredWithoutSubmissionLocationsNestedInput = {
    create?: XOR<SurveySubmissionCreateWithoutSubmissionLocationsInput, SurveySubmissionUncheckedCreateWithoutSubmissionLocationsInput>
    connectOrCreate?: SurveySubmissionCreateOrConnectWithoutSubmissionLocationsInput
    upsert?: SurveySubmissionUpsertWithoutSubmissionLocationsInput
    connect?: SurveySubmissionWhereUniqueInput
    update?: XOR<XOR<SurveySubmissionUpdateToOneWithWhereWithoutSubmissionLocationsInput, SurveySubmissionUpdateWithoutSubmissionLocationsInput>, SurveySubmissionUncheckedUpdateWithoutSubmissionLocationsInput>
  }

  export type LocationUpdateOneRequiredWithoutSubmissionLocationsNestedInput = {
    create?: XOR<LocationCreateWithoutSubmissionLocationsInput, LocationUncheckedCreateWithoutSubmissionLocationsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutSubmissionLocationsInput
    upsert?: LocationUpsertWithoutSubmissionLocationsInput
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutSubmissionLocationsInput, LocationUpdateWithoutSubmissionLocationsInput>, LocationUncheckedUpdateWithoutSubmissionLocationsInput>
  }

  export type SurveySubmissionCreateNestedOneWithoutRatingsInput = {
    create?: XOR<SurveySubmissionCreateWithoutRatingsInput, SurveySubmissionUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: SurveySubmissionCreateOrConnectWithoutRatingsInput
    connect?: SurveySubmissionWhereUniqueInput
  }

  export type LocationCreateNestedOneWithoutRatingsInput = {
    create?: XOR<LocationCreateWithoutRatingsInput, LocationUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutRatingsInput
    connect?: LocationWhereUniqueInput
  }

  export type SurveySubmissionUpdateOneRequiredWithoutRatingsNestedInput = {
    create?: XOR<SurveySubmissionCreateWithoutRatingsInput, SurveySubmissionUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: SurveySubmissionCreateOrConnectWithoutRatingsInput
    upsert?: SurveySubmissionUpsertWithoutRatingsInput
    connect?: SurveySubmissionWhereUniqueInput
    update?: XOR<XOR<SurveySubmissionUpdateToOneWithWhereWithoutRatingsInput, SurveySubmissionUpdateWithoutRatingsInput>, SurveySubmissionUncheckedUpdateWithoutRatingsInput>
  }

  export type LocationUpdateOneRequiredWithoutRatingsNestedInput = {
    create?: XOR<LocationCreateWithoutRatingsInput, LocationUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutRatingsInput
    upsert?: LocationUpsertWithoutRatingsInput
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutRatingsInput, LocationUpdateWithoutRatingsInput>, LocationUncheckedUpdateWithoutRatingsInput>
  }

  export type SurveySubmissionCreateNestedOneWithoutGeneralObservationsInput = {
    create?: XOR<SurveySubmissionCreateWithoutGeneralObservationsInput, SurveySubmissionUncheckedCreateWithoutGeneralObservationsInput>
    connectOrCreate?: SurveySubmissionCreateOrConnectWithoutGeneralObservationsInput
    connect?: SurveySubmissionWhereUniqueInput
  }

  export type SurveySubmissionUpdateOneRequiredWithoutGeneralObservationsNestedInput = {
    create?: XOR<SurveySubmissionCreateWithoutGeneralObservationsInput, SurveySubmissionUncheckedCreateWithoutGeneralObservationsInput>
    connectOrCreate?: SurveySubmissionCreateOrConnectWithoutGeneralObservationsInput
    upsert?: SurveySubmissionUpsertWithoutGeneralObservationsInput
    connect?: SurveySubmissionWhereUniqueInput
    update?: XOR<XOR<SurveySubmissionUpdateToOneWithWhereWithoutGeneralObservationsInput, SurveySubmissionUpdateWithoutGeneralObservationsInput>, SurveySubmissionUncheckedUpdateWithoutGeneralObservationsInput>
  }

  export type SurveySubmissionCreateNestedOneWithoutDepartmentConcernsInput = {
    create?: XOR<SurveySubmissionCreateWithoutDepartmentConcernsInput, SurveySubmissionUncheckedCreateWithoutDepartmentConcernsInput>
    connectOrCreate?: SurveySubmissionCreateOrConnectWithoutDepartmentConcernsInput
    connect?: SurveySubmissionWhereUniqueInput
  }

  export type LocationCreateNestedOneWithoutDepartmentConcernsInput = {
    create?: XOR<LocationCreateWithoutDepartmentConcernsInput, LocationUncheckedCreateWithoutDepartmentConcernsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutDepartmentConcernsInput
    connect?: LocationWhereUniqueInput
  }

  export type SurveySubmissionUpdateOneRequiredWithoutDepartmentConcernsNestedInput = {
    create?: XOR<SurveySubmissionCreateWithoutDepartmentConcernsInput, SurveySubmissionUncheckedCreateWithoutDepartmentConcernsInput>
    connectOrCreate?: SurveySubmissionCreateOrConnectWithoutDepartmentConcernsInput
    upsert?: SurveySubmissionUpsertWithoutDepartmentConcernsInput
    connect?: SurveySubmissionWhereUniqueInput
    update?: XOR<XOR<SurveySubmissionUpdateToOneWithWhereWithoutDepartmentConcernsInput, SurveySubmissionUpdateWithoutDepartmentConcernsInput>, SurveySubmissionUncheckedUpdateWithoutDepartmentConcernsInput>
  }

  export type LocationUpdateOneRequiredWithoutDepartmentConcernsNestedInput = {
    create?: XOR<LocationCreateWithoutDepartmentConcernsInput, LocationUncheckedCreateWithoutDepartmentConcernsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutDepartmentConcernsInput
    upsert?: LocationUpsertWithoutDepartmentConcernsInput
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutDepartmentConcernsInput, LocationUpdateWithoutDepartmentConcernsInput>, LocationUncheckedUpdateWithoutDepartmentConcernsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
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

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
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

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type SubmissionLocationCreateWithoutSubmissionInput = {
    isPrimary?: boolean
    createdAt?: Date | string
    location: LocationCreateNestedOneWithoutSubmissionLocationsInput
  }

  export type SubmissionLocationUncheckedCreateWithoutSubmissionInput = {
    id?: number
    locationId: number
    isPrimary?: boolean
    createdAt?: Date | string
  }

  export type SubmissionLocationCreateOrConnectWithoutSubmissionInput = {
    where: SubmissionLocationWhereUniqueInput
    create: XOR<SubmissionLocationCreateWithoutSubmissionInput, SubmissionLocationUncheckedCreateWithoutSubmissionInput>
  }

  export type SubmissionLocationCreateManySubmissionInputEnvelope = {
    data: SubmissionLocationCreateManySubmissionInput | SubmissionLocationCreateManySubmissionInput[]
    skipDuplicates?: boolean
  }

  export type RatingCreateWithoutSubmissionInput = {
    reception?: string | null
    professionalism?: string | null
    understanding?: string | null
    promptnessCare?: string | null
    promptnessFeedback?: string | null
    overall?: string | null
    admission?: string | null
    nurseProfessionalism?: string | null
    doctorProfessionalism?: string | null
    discharge?: string | null
    foodQuality?: string | null
    createdAt?: Date | string
    location: LocationCreateNestedOneWithoutRatingsInput
  }

  export type RatingUncheckedCreateWithoutSubmissionInput = {
    id?: number
    locationId: number
    reception?: string | null
    professionalism?: string | null
    understanding?: string | null
    promptnessCare?: string | null
    promptnessFeedback?: string | null
    overall?: string | null
    admission?: string | null
    nurseProfessionalism?: string | null
    doctorProfessionalism?: string | null
    discharge?: string | null
    foodQuality?: string | null
    createdAt?: Date | string
  }

  export type RatingCreateOrConnectWithoutSubmissionInput = {
    where: RatingWhereUniqueInput
    create: XOR<RatingCreateWithoutSubmissionInput, RatingUncheckedCreateWithoutSubmissionInput>
  }

  export type RatingCreateManySubmissionInputEnvelope = {
    data: RatingCreateManySubmissionInput | RatingCreateManySubmissionInput[]
    skipDuplicates?: boolean
  }

  export type GeneralObservationCreateWithoutSubmissionInput = {
    cleanliness?: string | null
    facilities?: string | null
    security?: string | null
    overall?: string | null
    createdAt?: Date | string
  }

  export type GeneralObservationUncheckedCreateWithoutSubmissionInput = {
    id?: number
    cleanliness?: string | null
    facilities?: string | null
    security?: string | null
    overall?: string | null
    createdAt?: Date | string
  }

  export type GeneralObservationCreateOrConnectWithoutSubmissionInput = {
    where: GeneralObservationWhereUniqueInput
    create: XOR<GeneralObservationCreateWithoutSubmissionInput, GeneralObservationUncheckedCreateWithoutSubmissionInput>
  }

  export type DepartmentConcernCreateWithoutSubmissionInput = {
    concern: string
    createdAt?: Date | string
    location: LocationCreateNestedOneWithoutDepartmentConcernsInput
  }

  export type DepartmentConcernUncheckedCreateWithoutSubmissionInput = {
    id?: number
    locationId: number
    concern: string
    createdAt?: Date | string
  }

  export type DepartmentConcernCreateOrConnectWithoutSubmissionInput = {
    where: DepartmentConcernWhereUniqueInput
    create: XOR<DepartmentConcernCreateWithoutSubmissionInput, DepartmentConcernUncheckedCreateWithoutSubmissionInput>
  }

  export type DepartmentConcernCreateManySubmissionInputEnvelope = {
    data: DepartmentConcernCreateManySubmissionInput | DepartmentConcernCreateManySubmissionInput[]
    skipDuplicates?: boolean
  }

  export type SubmissionLocationUpsertWithWhereUniqueWithoutSubmissionInput = {
    where: SubmissionLocationWhereUniqueInput
    update: XOR<SubmissionLocationUpdateWithoutSubmissionInput, SubmissionLocationUncheckedUpdateWithoutSubmissionInput>
    create: XOR<SubmissionLocationCreateWithoutSubmissionInput, SubmissionLocationUncheckedCreateWithoutSubmissionInput>
  }

  export type SubmissionLocationUpdateWithWhereUniqueWithoutSubmissionInput = {
    where: SubmissionLocationWhereUniqueInput
    data: XOR<SubmissionLocationUpdateWithoutSubmissionInput, SubmissionLocationUncheckedUpdateWithoutSubmissionInput>
  }

  export type SubmissionLocationUpdateManyWithWhereWithoutSubmissionInput = {
    where: SubmissionLocationScalarWhereInput
    data: XOR<SubmissionLocationUpdateManyMutationInput, SubmissionLocationUncheckedUpdateManyWithoutSubmissionInput>
  }

  export type SubmissionLocationScalarWhereInput = {
    AND?: SubmissionLocationScalarWhereInput | SubmissionLocationScalarWhereInput[]
    OR?: SubmissionLocationScalarWhereInput[]
    NOT?: SubmissionLocationScalarWhereInput | SubmissionLocationScalarWhereInput[]
    id?: IntFilter<"SubmissionLocation"> | number
    submissionId?: StringFilter<"SubmissionLocation"> | string
    locationId?: IntFilter<"SubmissionLocation"> | number
    isPrimary?: BoolFilter<"SubmissionLocation"> | boolean
    createdAt?: DateTimeFilter<"SubmissionLocation"> | Date | string
  }

  export type RatingUpsertWithWhereUniqueWithoutSubmissionInput = {
    where: RatingWhereUniqueInput
    update: XOR<RatingUpdateWithoutSubmissionInput, RatingUncheckedUpdateWithoutSubmissionInput>
    create: XOR<RatingCreateWithoutSubmissionInput, RatingUncheckedCreateWithoutSubmissionInput>
  }

  export type RatingUpdateWithWhereUniqueWithoutSubmissionInput = {
    where: RatingWhereUniqueInput
    data: XOR<RatingUpdateWithoutSubmissionInput, RatingUncheckedUpdateWithoutSubmissionInput>
  }

  export type RatingUpdateManyWithWhereWithoutSubmissionInput = {
    where: RatingScalarWhereInput
    data: XOR<RatingUpdateManyMutationInput, RatingUncheckedUpdateManyWithoutSubmissionInput>
  }

  export type RatingScalarWhereInput = {
    AND?: RatingScalarWhereInput | RatingScalarWhereInput[]
    OR?: RatingScalarWhereInput[]
    NOT?: RatingScalarWhereInput | RatingScalarWhereInput[]
    id?: IntFilter<"Rating"> | number
    submissionId?: StringFilter<"Rating"> | string
    locationId?: IntFilter<"Rating"> | number
    reception?: StringNullableFilter<"Rating"> | string | null
    professionalism?: StringNullableFilter<"Rating"> | string | null
    understanding?: StringNullableFilter<"Rating"> | string | null
    promptnessCare?: StringNullableFilter<"Rating"> | string | null
    promptnessFeedback?: StringNullableFilter<"Rating"> | string | null
    overall?: StringNullableFilter<"Rating"> | string | null
    admission?: StringNullableFilter<"Rating"> | string | null
    nurseProfessionalism?: StringNullableFilter<"Rating"> | string | null
    doctorProfessionalism?: StringNullableFilter<"Rating"> | string | null
    discharge?: StringNullableFilter<"Rating"> | string | null
    foodQuality?: StringNullableFilter<"Rating"> | string | null
    createdAt?: DateTimeFilter<"Rating"> | Date | string
  }

  export type GeneralObservationUpsertWithoutSubmissionInput = {
    update: XOR<GeneralObservationUpdateWithoutSubmissionInput, GeneralObservationUncheckedUpdateWithoutSubmissionInput>
    create: XOR<GeneralObservationCreateWithoutSubmissionInput, GeneralObservationUncheckedCreateWithoutSubmissionInput>
    where?: GeneralObservationWhereInput
  }

  export type GeneralObservationUpdateToOneWithWhereWithoutSubmissionInput = {
    where?: GeneralObservationWhereInput
    data: XOR<GeneralObservationUpdateWithoutSubmissionInput, GeneralObservationUncheckedUpdateWithoutSubmissionInput>
  }

  export type GeneralObservationUpdateWithoutSubmissionInput = {
    cleanliness?: NullableStringFieldUpdateOperationsInput | string | null
    facilities?: NullableStringFieldUpdateOperationsInput | string | null
    security?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeneralObservationUncheckedUpdateWithoutSubmissionInput = {
    id?: IntFieldUpdateOperationsInput | number
    cleanliness?: NullableStringFieldUpdateOperationsInput | string | null
    facilities?: NullableStringFieldUpdateOperationsInput | string | null
    security?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentConcernUpsertWithWhereUniqueWithoutSubmissionInput = {
    where: DepartmentConcernWhereUniqueInput
    update: XOR<DepartmentConcernUpdateWithoutSubmissionInput, DepartmentConcernUncheckedUpdateWithoutSubmissionInput>
    create: XOR<DepartmentConcernCreateWithoutSubmissionInput, DepartmentConcernUncheckedCreateWithoutSubmissionInput>
  }

  export type DepartmentConcernUpdateWithWhereUniqueWithoutSubmissionInput = {
    where: DepartmentConcernWhereUniqueInput
    data: XOR<DepartmentConcernUpdateWithoutSubmissionInput, DepartmentConcernUncheckedUpdateWithoutSubmissionInput>
  }

  export type DepartmentConcernUpdateManyWithWhereWithoutSubmissionInput = {
    where: DepartmentConcernScalarWhereInput
    data: XOR<DepartmentConcernUpdateManyMutationInput, DepartmentConcernUncheckedUpdateManyWithoutSubmissionInput>
  }

  export type DepartmentConcernScalarWhereInput = {
    AND?: DepartmentConcernScalarWhereInput | DepartmentConcernScalarWhereInput[]
    OR?: DepartmentConcernScalarWhereInput[]
    NOT?: DepartmentConcernScalarWhereInput | DepartmentConcernScalarWhereInput[]
    id?: IntFilter<"DepartmentConcern"> | number
    submissionId?: StringFilter<"DepartmentConcern"> | string
    locationId?: IntFilter<"DepartmentConcern"> | number
    concern?: StringFilter<"DepartmentConcern"> | string
    createdAt?: DateTimeFilter<"DepartmentConcern"> | Date | string
  }

  export type SubmissionLocationCreateWithoutLocationInput = {
    isPrimary?: boolean
    createdAt?: Date | string
    submission: SurveySubmissionCreateNestedOneWithoutSubmissionLocationsInput
  }

  export type SubmissionLocationUncheckedCreateWithoutLocationInput = {
    id?: number
    submissionId: string
    isPrimary?: boolean
    createdAt?: Date | string
  }

  export type SubmissionLocationCreateOrConnectWithoutLocationInput = {
    where: SubmissionLocationWhereUniqueInput
    create: XOR<SubmissionLocationCreateWithoutLocationInput, SubmissionLocationUncheckedCreateWithoutLocationInput>
  }

  export type SubmissionLocationCreateManyLocationInputEnvelope = {
    data: SubmissionLocationCreateManyLocationInput | SubmissionLocationCreateManyLocationInput[]
    skipDuplicates?: boolean
  }

  export type RatingCreateWithoutLocationInput = {
    reception?: string | null
    professionalism?: string | null
    understanding?: string | null
    promptnessCare?: string | null
    promptnessFeedback?: string | null
    overall?: string | null
    admission?: string | null
    nurseProfessionalism?: string | null
    doctorProfessionalism?: string | null
    discharge?: string | null
    foodQuality?: string | null
    createdAt?: Date | string
    submission: SurveySubmissionCreateNestedOneWithoutRatingsInput
  }

  export type RatingUncheckedCreateWithoutLocationInput = {
    id?: number
    submissionId: string
    reception?: string | null
    professionalism?: string | null
    understanding?: string | null
    promptnessCare?: string | null
    promptnessFeedback?: string | null
    overall?: string | null
    admission?: string | null
    nurseProfessionalism?: string | null
    doctorProfessionalism?: string | null
    discharge?: string | null
    foodQuality?: string | null
    createdAt?: Date | string
  }

  export type RatingCreateOrConnectWithoutLocationInput = {
    where: RatingWhereUniqueInput
    create: XOR<RatingCreateWithoutLocationInput, RatingUncheckedCreateWithoutLocationInput>
  }

  export type RatingCreateManyLocationInputEnvelope = {
    data: RatingCreateManyLocationInput | RatingCreateManyLocationInput[]
    skipDuplicates?: boolean
  }

  export type DepartmentConcernCreateWithoutLocationInput = {
    concern: string
    createdAt?: Date | string
    submission: SurveySubmissionCreateNestedOneWithoutDepartmentConcernsInput
  }

  export type DepartmentConcernUncheckedCreateWithoutLocationInput = {
    id?: number
    submissionId: string
    concern: string
    createdAt?: Date | string
  }

  export type DepartmentConcernCreateOrConnectWithoutLocationInput = {
    where: DepartmentConcernWhereUniqueInput
    create: XOR<DepartmentConcernCreateWithoutLocationInput, DepartmentConcernUncheckedCreateWithoutLocationInput>
  }

  export type DepartmentConcernCreateManyLocationInputEnvelope = {
    data: DepartmentConcernCreateManyLocationInput | DepartmentConcernCreateManyLocationInput[]
    skipDuplicates?: boolean
  }

  export type SubmissionLocationUpsertWithWhereUniqueWithoutLocationInput = {
    where: SubmissionLocationWhereUniqueInput
    update: XOR<SubmissionLocationUpdateWithoutLocationInput, SubmissionLocationUncheckedUpdateWithoutLocationInput>
    create: XOR<SubmissionLocationCreateWithoutLocationInput, SubmissionLocationUncheckedCreateWithoutLocationInput>
  }

  export type SubmissionLocationUpdateWithWhereUniqueWithoutLocationInput = {
    where: SubmissionLocationWhereUniqueInput
    data: XOR<SubmissionLocationUpdateWithoutLocationInput, SubmissionLocationUncheckedUpdateWithoutLocationInput>
  }

  export type SubmissionLocationUpdateManyWithWhereWithoutLocationInput = {
    where: SubmissionLocationScalarWhereInput
    data: XOR<SubmissionLocationUpdateManyMutationInput, SubmissionLocationUncheckedUpdateManyWithoutLocationInput>
  }

  export type RatingUpsertWithWhereUniqueWithoutLocationInput = {
    where: RatingWhereUniqueInput
    update: XOR<RatingUpdateWithoutLocationInput, RatingUncheckedUpdateWithoutLocationInput>
    create: XOR<RatingCreateWithoutLocationInput, RatingUncheckedCreateWithoutLocationInput>
  }

  export type RatingUpdateWithWhereUniqueWithoutLocationInput = {
    where: RatingWhereUniqueInput
    data: XOR<RatingUpdateWithoutLocationInput, RatingUncheckedUpdateWithoutLocationInput>
  }

  export type RatingUpdateManyWithWhereWithoutLocationInput = {
    where: RatingScalarWhereInput
    data: XOR<RatingUpdateManyMutationInput, RatingUncheckedUpdateManyWithoutLocationInput>
  }

  export type DepartmentConcernUpsertWithWhereUniqueWithoutLocationInput = {
    where: DepartmentConcernWhereUniqueInput
    update: XOR<DepartmentConcernUpdateWithoutLocationInput, DepartmentConcernUncheckedUpdateWithoutLocationInput>
    create: XOR<DepartmentConcernCreateWithoutLocationInput, DepartmentConcernUncheckedCreateWithoutLocationInput>
  }

  export type DepartmentConcernUpdateWithWhereUniqueWithoutLocationInput = {
    where: DepartmentConcernWhereUniqueInput
    data: XOR<DepartmentConcernUpdateWithoutLocationInput, DepartmentConcernUncheckedUpdateWithoutLocationInput>
  }

  export type DepartmentConcernUpdateManyWithWhereWithoutLocationInput = {
    where: DepartmentConcernScalarWhereInput
    data: XOR<DepartmentConcernUpdateManyMutationInput, DepartmentConcernUncheckedUpdateManyWithoutLocationInput>
  }

  export type SurveySubmissionCreateWithoutSubmissionLocationsInput = {
    id?: string
    visitTime: string
    visitPurpose: string
    visitedOtherPlaces?: boolean
    wouldRecommend?: boolean | null
    whyNotRecommend?: string | null
    recommendation?: string | null
    userType: string
    patientType: string
    submittedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    ratings?: RatingCreateNestedManyWithoutSubmissionInput
    generalObservations?: GeneralObservationCreateNestedOneWithoutSubmissionInput
    departmentConcerns?: DepartmentConcernCreateNestedManyWithoutSubmissionInput
  }

  export type SurveySubmissionUncheckedCreateWithoutSubmissionLocationsInput = {
    id?: string
    visitTime: string
    visitPurpose: string
    visitedOtherPlaces?: boolean
    wouldRecommend?: boolean | null
    whyNotRecommend?: string | null
    recommendation?: string | null
    userType: string
    patientType: string
    submittedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    ratings?: RatingUncheckedCreateNestedManyWithoutSubmissionInput
    generalObservations?: GeneralObservationUncheckedCreateNestedOneWithoutSubmissionInput
    departmentConcerns?: DepartmentConcernUncheckedCreateNestedManyWithoutSubmissionInput
  }

  export type SurveySubmissionCreateOrConnectWithoutSubmissionLocationsInput = {
    where: SurveySubmissionWhereUniqueInput
    create: XOR<SurveySubmissionCreateWithoutSubmissionLocationsInput, SurveySubmissionUncheckedCreateWithoutSubmissionLocationsInput>
  }

  export type LocationCreateWithoutSubmissionLocationsInput = {
    name: string
    locationType: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ratings?: RatingCreateNestedManyWithoutLocationInput
    departmentConcerns?: DepartmentConcernCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateWithoutSubmissionLocationsInput = {
    id?: number
    name: string
    locationType: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ratings?: RatingUncheckedCreateNestedManyWithoutLocationInput
    departmentConcerns?: DepartmentConcernUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationCreateOrConnectWithoutSubmissionLocationsInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutSubmissionLocationsInput, LocationUncheckedCreateWithoutSubmissionLocationsInput>
  }

  export type SurveySubmissionUpsertWithoutSubmissionLocationsInput = {
    update: XOR<SurveySubmissionUpdateWithoutSubmissionLocationsInput, SurveySubmissionUncheckedUpdateWithoutSubmissionLocationsInput>
    create: XOR<SurveySubmissionCreateWithoutSubmissionLocationsInput, SurveySubmissionUncheckedCreateWithoutSubmissionLocationsInput>
    where?: SurveySubmissionWhereInput
  }

  export type SurveySubmissionUpdateToOneWithWhereWithoutSubmissionLocationsInput = {
    where?: SurveySubmissionWhereInput
    data: XOR<SurveySubmissionUpdateWithoutSubmissionLocationsInput, SurveySubmissionUncheckedUpdateWithoutSubmissionLocationsInput>
  }

  export type SurveySubmissionUpdateWithoutSubmissionLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitTime?: StringFieldUpdateOperationsInput | string
    visitPurpose?: StringFieldUpdateOperationsInput | string
    visitedOtherPlaces?: BoolFieldUpdateOperationsInput | boolean
    wouldRecommend?: NullableBoolFieldUpdateOperationsInput | boolean | null
    whyNotRecommend?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    userType?: StringFieldUpdateOperationsInput | string
    patientType?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ratings?: RatingUpdateManyWithoutSubmissionNestedInput
    generalObservations?: GeneralObservationUpdateOneWithoutSubmissionNestedInput
    departmentConcerns?: DepartmentConcernUpdateManyWithoutSubmissionNestedInput
  }

  export type SurveySubmissionUncheckedUpdateWithoutSubmissionLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitTime?: StringFieldUpdateOperationsInput | string
    visitPurpose?: StringFieldUpdateOperationsInput | string
    visitedOtherPlaces?: BoolFieldUpdateOperationsInput | boolean
    wouldRecommend?: NullableBoolFieldUpdateOperationsInput | boolean | null
    whyNotRecommend?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    userType?: StringFieldUpdateOperationsInput | string
    patientType?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ratings?: RatingUncheckedUpdateManyWithoutSubmissionNestedInput
    generalObservations?: GeneralObservationUncheckedUpdateOneWithoutSubmissionNestedInput
    departmentConcerns?: DepartmentConcernUncheckedUpdateManyWithoutSubmissionNestedInput
  }

  export type LocationUpsertWithoutSubmissionLocationsInput = {
    update: XOR<LocationUpdateWithoutSubmissionLocationsInput, LocationUncheckedUpdateWithoutSubmissionLocationsInput>
    create: XOR<LocationCreateWithoutSubmissionLocationsInput, LocationUncheckedCreateWithoutSubmissionLocationsInput>
    where?: LocationWhereInput
  }

  export type LocationUpdateToOneWithWhereWithoutSubmissionLocationsInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutSubmissionLocationsInput, LocationUncheckedUpdateWithoutSubmissionLocationsInput>
  }

  export type LocationUpdateWithoutSubmissionLocationsInput = {
    name?: StringFieldUpdateOperationsInput | string
    locationType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ratings?: RatingUpdateManyWithoutLocationNestedInput
    departmentConcerns?: DepartmentConcernUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateWithoutSubmissionLocationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    locationType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ratings?: RatingUncheckedUpdateManyWithoutLocationNestedInput
    departmentConcerns?: DepartmentConcernUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type SurveySubmissionCreateWithoutRatingsInput = {
    id?: string
    visitTime: string
    visitPurpose: string
    visitedOtherPlaces?: boolean
    wouldRecommend?: boolean | null
    whyNotRecommend?: string | null
    recommendation?: string | null
    userType: string
    patientType: string
    submittedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    submissionLocations?: SubmissionLocationCreateNestedManyWithoutSubmissionInput
    generalObservations?: GeneralObservationCreateNestedOneWithoutSubmissionInput
    departmentConcerns?: DepartmentConcernCreateNestedManyWithoutSubmissionInput
  }

  export type SurveySubmissionUncheckedCreateWithoutRatingsInput = {
    id?: string
    visitTime: string
    visitPurpose: string
    visitedOtherPlaces?: boolean
    wouldRecommend?: boolean | null
    whyNotRecommend?: string | null
    recommendation?: string | null
    userType: string
    patientType: string
    submittedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    submissionLocations?: SubmissionLocationUncheckedCreateNestedManyWithoutSubmissionInput
    generalObservations?: GeneralObservationUncheckedCreateNestedOneWithoutSubmissionInput
    departmentConcerns?: DepartmentConcernUncheckedCreateNestedManyWithoutSubmissionInput
  }

  export type SurveySubmissionCreateOrConnectWithoutRatingsInput = {
    where: SurveySubmissionWhereUniqueInput
    create: XOR<SurveySubmissionCreateWithoutRatingsInput, SurveySubmissionUncheckedCreateWithoutRatingsInput>
  }

  export type LocationCreateWithoutRatingsInput = {
    name: string
    locationType: string
    createdAt?: Date | string
    updatedAt?: Date | string
    submissionLocations?: SubmissionLocationCreateNestedManyWithoutLocationInput
    departmentConcerns?: DepartmentConcernCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateWithoutRatingsInput = {
    id?: number
    name: string
    locationType: string
    createdAt?: Date | string
    updatedAt?: Date | string
    submissionLocations?: SubmissionLocationUncheckedCreateNestedManyWithoutLocationInput
    departmentConcerns?: DepartmentConcernUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationCreateOrConnectWithoutRatingsInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutRatingsInput, LocationUncheckedCreateWithoutRatingsInput>
  }

  export type SurveySubmissionUpsertWithoutRatingsInput = {
    update: XOR<SurveySubmissionUpdateWithoutRatingsInput, SurveySubmissionUncheckedUpdateWithoutRatingsInput>
    create: XOR<SurveySubmissionCreateWithoutRatingsInput, SurveySubmissionUncheckedCreateWithoutRatingsInput>
    where?: SurveySubmissionWhereInput
  }

  export type SurveySubmissionUpdateToOneWithWhereWithoutRatingsInput = {
    where?: SurveySubmissionWhereInput
    data: XOR<SurveySubmissionUpdateWithoutRatingsInput, SurveySubmissionUncheckedUpdateWithoutRatingsInput>
  }

  export type SurveySubmissionUpdateWithoutRatingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitTime?: StringFieldUpdateOperationsInput | string
    visitPurpose?: StringFieldUpdateOperationsInput | string
    visitedOtherPlaces?: BoolFieldUpdateOperationsInput | boolean
    wouldRecommend?: NullableBoolFieldUpdateOperationsInput | boolean | null
    whyNotRecommend?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    userType?: StringFieldUpdateOperationsInput | string
    patientType?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissionLocations?: SubmissionLocationUpdateManyWithoutSubmissionNestedInput
    generalObservations?: GeneralObservationUpdateOneWithoutSubmissionNestedInput
    departmentConcerns?: DepartmentConcernUpdateManyWithoutSubmissionNestedInput
  }

  export type SurveySubmissionUncheckedUpdateWithoutRatingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitTime?: StringFieldUpdateOperationsInput | string
    visitPurpose?: StringFieldUpdateOperationsInput | string
    visitedOtherPlaces?: BoolFieldUpdateOperationsInput | boolean
    wouldRecommend?: NullableBoolFieldUpdateOperationsInput | boolean | null
    whyNotRecommend?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    userType?: StringFieldUpdateOperationsInput | string
    patientType?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissionLocations?: SubmissionLocationUncheckedUpdateManyWithoutSubmissionNestedInput
    generalObservations?: GeneralObservationUncheckedUpdateOneWithoutSubmissionNestedInput
    departmentConcerns?: DepartmentConcernUncheckedUpdateManyWithoutSubmissionNestedInput
  }

  export type LocationUpsertWithoutRatingsInput = {
    update: XOR<LocationUpdateWithoutRatingsInput, LocationUncheckedUpdateWithoutRatingsInput>
    create: XOR<LocationCreateWithoutRatingsInput, LocationUncheckedCreateWithoutRatingsInput>
    where?: LocationWhereInput
  }

  export type LocationUpdateToOneWithWhereWithoutRatingsInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutRatingsInput, LocationUncheckedUpdateWithoutRatingsInput>
  }

  export type LocationUpdateWithoutRatingsInput = {
    name?: StringFieldUpdateOperationsInput | string
    locationType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissionLocations?: SubmissionLocationUpdateManyWithoutLocationNestedInput
    departmentConcerns?: DepartmentConcernUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateWithoutRatingsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    locationType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissionLocations?: SubmissionLocationUncheckedUpdateManyWithoutLocationNestedInput
    departmentConcerns?: DepartmentConcernUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type SurveySubmissionCreateWithoutGeneralObservationsInput = {
    id?: string
    visitTime: string
    visitPurpose: string
    visitedOtherPlaces?: boolean
    wouldRecommend?: boolean | null
    whyNotRecommend?: string | null
    recommendation?: string | null
    userType: string
    patientType: string
    submittedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    submissionLocations?: SubmissionLocationCreateNestedManyWithoutSubmissionInput
    ratings?: RatingCreateNestedManyWithoutSubmissionInput
    departmentConcerns?: DepartmentConcernCreateNestedManyWithoutSubmissionInput
  }

  export type SurveySubmissionUncheckedCreateWithoutGeneralObservationsInput = {
    id?: string
    visitTime: string
    visitPurpose: string
    visitedOtherPlaces?: boolean
    wouldRecommend?: boolean | null
    whyNotRecommend?: string | null
    recommendation?: string | null
    userType: string
    patientType: string
    submittedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    submissionLocations?: SubmissionLocationUncheckedCreateNestedManyWithoutSubmissionInput
    ratings?: RatingUncheckedCreateNestedManyWithoutSubmissionInput
    departmentConcerns?: DepartmentConcernUncheckedCreateNestedManyWithoutSubmissionInput
  }

  export type SurveySubmissionCreateOrConnectWithoutGeneralObservationsInput = {
    where: SurveySubmissionWhereUniqueInput
    create: XOR<SurveySubmissionCreateWithoutGeneralObservationsInput, SurveySubmissionUncheckedCreateWithoutGeneralObservationsInput>
  }

  export type SurveySubmissionUpsertWithoutGeneralObservationsInput = {
    update: XOR<SurveySubmissionUpdateWithoutGeneralObservationsInput, SurveySubmissionUncheckedUpdateWithoutGeneralObservationsInput>
    create: XOR<SurveySubmissionCreateWithoutGeneralObservationsInput, SurveySubmissionUncheckedCreateWithoutGeneralObservationsInput>
    where?: SurveySubmissionWhereInput
  }

  export type SurveySubmissionUpdateToOneWithWhereWithoutGeneralObservationsInput = {
    where?: SurveySubmissionWhereInput
    data: XOR<SurveySubmissionUpdateWithoutGeneralObservationsInput, SurveySubmissionUncheckedUpdateWithoutGeneralObservationsInput>
  }

  export type SurveySubmissionUpdateWithoutGeneralObservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitTime?: StringFieldUpdateOperationsInput | string
    visitPurpose?: StringFieldUpdateOperationsInput | string
    visitedOtherPlaces?: BoolFieldUpdateOperationsInput | boolean
    wouldRecommend?: NullableBoolFieldUpdateOperationsInput | boolean | null
    whyNotRecommend?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    userType?: StringFieldUpdateOperationsInput | string
    patientType?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissionLocations?: SubmissionLocationUpdateManyWithoutSubmissionNestedInput
    ratings?: RatingUpdateManyWithoutSubmissionNestedInput
    departmentConcerns?: DepartmentConcernUpdateManyWithoutSubmissionNestedInput
  }

  export type SurveySubmissionUncheckedUpdateWithoutGeneralObservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitTime?: StringFieldUpdateOperationsInput | string
    visitPurpose?: StringFieldUpdateOperationsInput | string
    visitedOtherPlaces?: BoolFieldUpdateOperationsInput | boolean
    wouldRecommend?: NullableBoolFieldUpdateOperationsInput | boolean | null
    whyNotRecommend?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    userType?: StringFieldUpdateOperationsInput | string
    patientType?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissionLocations?: SubmissionLocationUncheckedUpdateManyWithoutSubmissionNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutSubmissionNestedInput
    departmentConcerns?: DepartmentConcernUncheckedUpdateManyWithoutSubmissionNestedInput
  }

  export type SurveySubmissionCreateWithoutDepartmentConcernsInput = {
    id?: string
    visitTime: string
    visitPurpose: string
    visitedOtherPlaces?: boolean
    wouldRecommend?: boolean | null
    whyNotRecommend?: string | null
    recommendation?: string | null
    userType: string
    patientType: string
    submittedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    submissionLocations?: SubmissionLocationCreateNestedManyWithoutSubmissionInput
    ratings?: RatingCreateNestedManyWithoutSubmissionInput
    generalObservations?: GeneralObservationCreateNestedOneWithoutSubmissionInput
  }

  export type SurveySubmissionUncheckedCreateWithoutDepartmentConcernsInput = {
    id?: string
    visitTime: string
    visitPurpose: string
    visitedOtherPlaces?: boolean
    wouldRecommend?: boolean | null
    whyNotRecommend?: string | null
    recommendation?: string | null
    userType: string
    patientType: string
    submittedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    submissionLocations?: SubmissionLocationUncheckedCreateNestedManyWithoutSubmissionInput
    ratings?: RatingUncheckedCreateNestedManyWithoutSubmissionInput
    generalObservations?: GeneralObservationUncheckedCreateNestedOneWithoutSubmissionInput
  }

  export type SurveySubmissionCreateOrConnectWithoutDepartmentConcernsInput = {
    where: SurveySubmissionWhereUniqueInput
    create: XOR<SurveySubmissionCreateWithoutDepartmentConcernsInput, SurveySubmissionUncheckedCreateWithoutDepartmentConcernsInput>
  }

  export type LocationCreateWithoutDepartmentConcernsInput = {
    name: string
    locationType: string
    createdAt?: Date | string
    updatedAt?: Date | string
    submissionLocations?: SubmissionLocationCreateNestedManyWithoutLocationInput
    ratings?: RatingCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateWithoutDepartmentConcernsInput = {
    id?: number
    name: string
    locationType: string
    createdAt?: Date | string
    updatedAt?: Date | string
    submissionLocations?: SubmissionLocationUncheckedCreateNestedManyWithoutLocationInput
    ratings?: RatingUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationCreateOrConnectWithoutDepartmentConcernsInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutDepartmentConcernsInput, LocationUncheckedCreateWithoutDepartmentConcernsInput>
  }

  export type SurveySubmissionUpsertWithoutDepartmentConcernsInput = {
    update: XOR<SurveySubmissionUpdateWithoutDepartmentConcernsInput, SurveySubmissionUncheckedUpdateWithoutDepartmentConcernsInput>
    create: XOR<SurveySubmissionCreateWithoutDepartmentConcernsInput, SurveySubmissionUncheckedCreateWithoutDepartmentConcernsInput>
    where?: SurveySubmissionWhereInput
  }

  export type SurveySubmissionUpdateToOneWithWhereWithoutDepartmentConcernsInput = {
    where?: SurveySubmissionWhereInput
    data: XOR<SurveySubmissionUpdateWithoutDepartmentConcernsInput, SurveySubmissionUncheckedUpdateWithoutDepartmentConcernsInput>
  }

  export type SurveySubmissionUpdateWithoutDepartmentConcernsInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitTime?: StringFieldUpdateOperationsInput | string
    visitPurpose?: StringFieldUpdateOperationsInput | string
    visitedOtherPlaces?: BoolFieldUpdateOperationsInput | boolean
    wouldRecommend?: NullableBoolFieldUpdateOperationsInput | boolean | null
    whyNotRecommend?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    userType?: StringFieldUpdateOperationsInput | string
    patientType?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissionLocations?: SubmissionLocationUpdateManyWithoutSubmissionNestedInput
    ratings?: RatingUpdateManyWithoutSubmissionNestedInput
    generalObservations?: GeneralObservationUpdateOneWithoutSubmissionNestedInput
  }

  export type SurveySubmissionUncheckedUpdateWithoutDepartmentConcernsInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitTime?: StringFieldUpdateOperationsInput | string
    visitPurpose?: StringFieldUpdateOperationsInput | string
    visitedOtherPlaces?: BoolFieldUpdateOperationsInput | boolean
    wouldRecommend?: NullableBoolFieldUpdateOperationsInput | boolean | null
    whyNotRecommend?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    userType?: StringFieldUpdateOperationsInput | string
    patientType?: StringFieldUpdateOperationsInput | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissionLocations?: SubmissionLocationUncheckedUpdateManyWithoutSubmissionNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutSubmissionNestedInput
    generalObservations?: GeneralObservationUncheckedUpdateOneWithoutSubmissionNestedInput
  }

  export type LocationUpsertWithoutDepartmentConcernsInput = {
    update: XOR<LocationUpdateWithoutDepartmentConcernsInput, LocationUncheckedUpdateWithoutDepartmentConcernsInput>
    create: XOR<LocationCreateWithoutDepartmentConcernsInput, LocationUncheckedCreateWithoutDepartmentConcernsInput>
    where?: LocationWhereInput
  }

  export type LocationUpdateToOneWithWhereWithoutDepartmentConcernsInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutDepartmentConcernsInput, LocationUncheckedUpdateWithoutDepartmentConcernsInput>
  }

  export type LocationUpdateWithoutDepartmentConcernsInput = {
    name?: StringFieldUpdateOperationsInput | string
    locationType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissionLocations?: SubmissionLocationUpdateManyWithoutLocationNestedInput
    ratings?: RatingUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateWithoutDepartmentConcernsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    locationType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissionLocations?: SubmissionLocationUncheckedUpdateManyWithoutLocationNestedInput
    ratings?: RatingUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type SubmissionLocationCreateManySubmissionInput = {
    id?: number
    locationId: number
    isPrimary?: boolean
    createdAt?: Date | string
  }

  export type RatingCreateManySubmissionInput = {
    id?: number
    locationId: number
    reception?: string | null
    professionalism?: string | null
    understanding?: string | null
    promptnessCare?: string | null
    promptnessFeedback?: string | null
    overall?: string | null
    admission?: string | null
    nurseProfessionalism?: string | null
    doctorProfessionalism?: string | null
    discharge?: string | null
    foodQuality?: string | null
    createdAt?: Date | string
  }

  export type DepartmentConcernCreateManySubmissionInput = {
    id?: number
    locationId: number
    concern: string
    createdAt?: Date | string
  }

  export type SubmissionLocationUpdateWithoutSubmissionInput = {
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: LocationUpdateOneRequiredWithoutSubmissionLocationsNestedInput
  }

  export type SubmissionLocationUncheckedUpdateWithoutSubmissionInput = {
    id?: IntFieldUpdateOperationsInput | number
    locationId?: IntFieldUpdateOperationsInput | number
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionLocationUncheckedUpdateManyWithoutSubmissionInput = {
    id?: IntFieldUpdateOperationsInput | number
    locationId?: IntFieldUpdateOperationsInput | number
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUpdateWithoutSubmissionInput = {
    reception?: NullableStringFieldUpdateOperationsInput | string | null
    professionalism?: NullableStringFieldUpdateOperationsInput | string | null
    understanding?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessCare?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    admission?: NullableStringFieldUpdateOperationsInput | string | null
    nurseProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    doctorProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    discharge?: NullableStringFieldUpdateOperationsInput | string | null
    foodQuality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: LocationUpdateOneRequiredWithoutRatingsNestedInput
  }

  export type RatingUncheckedUpdateWithoutSubmissionInput = {
    id?: IntFieldUpdateOperationsInput | number
    locationId?: IntFieldUpdateOperationsInput | number
    reception?: NullableStringFieldUpdateOperationsInput | string | null
    professionalism?: NullableStringFieldUpdateOperationsInput | string | null
    understanding?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessCare?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    admission?: NullableStringFieldUpdateOperationsInput | string | null
    nurseProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    doctorProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    discharge?: NullableStringFieldUpdateOperationsInput | string | null
    foodQuality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUncheckedUpdateManyWithoutSubmissionInput = {
    id?: IntFieldUpdateOperationsInput | number
    locationId?: IntFieldUpdateOperationsInput | number
    reception?: NullableStringFieldUpdateOperationsInput | string | null
    professionalism?: NullableStringFieldUpdateOperationsInput | string | null
    understanding?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessCare?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    admission?: NullableStringFieldUpdateOperationsInput | string | null
    nurseProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    doctorProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    discharge?: NullableStringFieldUpdateOperationsInput | string | null
    foodQuality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentConcernUpdateWithoutSubmissionInput = {
    concern?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: LocationUpdateOneRequiredWithoutDepartmentConcernsNestedInput
  }

  export type DepartmentConcernUncheckedUpdateWithoutSubmissionInput = {
    id?: IntFieldUpdateOperationsInput | number
    locationId?: IntFieldUpdateOperationsInput | number
    concern?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentConcernUncheckedUpdateManyWithoutSubmissionInput = {
    id?: IntFieldUpdateOperationsInput | number
    locationId?: IntFieldUpdateOperationsInput | number
    concern?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionLocationCreateManyLocationInput = {
    id?: number
    submissionId: string
    isPrimary?: boolean
    createdAt?: Date | string
  }

  export type RatingCreateManyLocationInput = {
    id?: number
    submissionId: string
    reception?: string | null
    professionalism?: string | null
    understanding?: string | null
    promptnessCare?: string | null
    promptnessFeedback?: string | null
    overall?: string | null
    admission?: string | null
    nurseProfessionalism?: string | null
    doctorProfessionalism?: string | null
    discharge?: string | null
    foodQuality?: string | null
    createdAt?: Date | string
  }

  export type DepartmentConcernCreateManyLocationInput = {
    id?: number
    submissionId: string
    concern: string
    createdAt?: Date | string
  }

  export type SubmissionLocationUpdateWithoutLocationInput = {
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submission?: SurveySubmissionUpdateOneRequiredWithoutSubmissionLocationsNestedInput
  }

  export type SubmissionLocationUncheckedUpdateWithoutLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    submissionId?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubmissionLocationUncheckedUpdateManyWithoutLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    submissionId?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUpdateWithoutLocationInput = {
    reception?: NullableStringFieldUpdateOperationsInput | string | null
    professionalism?: NullableStringFieldUpdateOperationsInput | string | null
    understanding?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessCare?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    admission?: NullableStringFieldUpdateOperationsInput | string | null
    nurseProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    doctorProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    discharge?: NullableStringFieldUpdateOperationsInput | string | null
    foodQuality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submission?: SurveySubmissionUpdateOneRequiredWithoutRatingsNestedInput
  }

  export type RatingUncheckedUpdateWithoutLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    submissionId?: StringFieldUpdateOperationsInput | string
    reception?: NullableStringFieldUpdateOperationsInput | string | null
    professionalism?: NullableStringFieldUpdateOperationsInput | string | null
    understanding?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessCare?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    admission?: NullableStringFieldUpdateOperationsInput | string | null
    nurseProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    doctorProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    discharge?: NullableStringFieldUpdateOperationsInput | string | null
    foodQuality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUncheckedUpdateManyWithoutLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    submissionId?: StringFieldUpdateOperationsInput | string
    reception?: NullableStringFieldUpdateOperationsInput | string | null
    professionalism?: NullableStringFieldUpdateOperationsInput | string | null
    understanding?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessCare?: NullableStringFieldUpdateOperationsInput | string | null
    promptnessFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    overall?: NullableStringFieldUpdateOperationsInput | string | null
    admission?: NullableStringFieldUpdateOperationsInput | string | null
    nurseProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    doctorProfessionalism?: NullableStringFieldUpdateOperationsInput | string | null
    discharge?: NullableStringFieldUpdateOperationsInput | string | null
    foodQuality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentConcernUpdateWithoutLocationInput = {
    concern?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submission?: SurveySubmissionUpdateOneRequiredWithoutDepartmentConcernsNestedInput
  }

  export type DepartmentConcernUncheckedUpdateWithoutLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    submissionId?: StringFieldUpdateOperationsInput | string
    concern?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentConcernUncheckedUpdateManyWithoutLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    submissionId?: StringFieldUpdateOperationsInput | string
    concern?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use SurveySubmissionCountOutputTypeDefaultArgs instead
     */
    export type SurveySubmissionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SurveySubmissionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LocationCountOutputTypeDefaultArgs instead
     */
    export type LocationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LocationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SurveySubmissionDefaultArgs instead
     */
    export type SurveySubmissionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SurveySubmissionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LocationDefaultArgs instead
     */
    export type LocationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LocationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SubmissionLocationDefaultArgs instead
     */
    export type SubmissionLocationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SubmissionLocationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RatingDefaultArgs instead
     */
    export type RatingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RatingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GeneralObservationDefaultArgs instead
     */
    export type GeneralObservationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GeneralObservationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DepartmentConcernDefaultArgs instead
     */
    export type DepartmentConcernArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DepartmentConcernDefaultArgs<ExtArgs>

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