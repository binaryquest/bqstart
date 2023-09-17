/**
 * A generic class to model response from a OData API
 *
 * @export
 * @class ODataResponse
 * @template T
 */
export class ODataResponse<T> {
    private static getMetadata(data: any): Map<string, any> {
        const metadata = new Map<string, any>();
        Object.keys(data)
            .filter((key) => key.startsWith("@odata"))
            .forEach((key) => metadata.set(key.replace("@odata.", ""), data[key]));
        return metadata;
    }

    private static getEntity<T>(data: any): T {
        let entity = {} as T; // tslint:disable-line:prefer-const
        Object.keys(data)
            .filter((key) => !key.startsWith("@odata"))
            .forEach((key) => entity[key as keyof T] = data[key]);
        return entity;
    }

    private static getEntities<T>(data: any): T[] {
        const keys = Object.keys(data).filter((key) => !key.startsWith("@odata"));
        if (keys.length === 1 && keys[0] === "value") {
            return (data.value as T[]);
        }
        return [];
    }

    /**
     * The meta data information for a entity type
     *
     * @type {Map<string, any>}
     * @memberof ODataResponse
     */
    public readonly metadata: Map<string, any>;

    /**
     *  Single Entity Result
     *
     * @type {(T | null)}
     * @memberof ODataResponse
     */
    public readonly entity: T | null;


    /**
     * Return a list of entities
     *
     * @type {T[]}
     * @memberof ODataResponse
     */
    public readonly entities: T[];

    /**
     * Creates an instance of ODataResponse.
     * @param {*} response
     * @memberof ODataResponse
     */
    constructor(response: any) {
        this.metadata = ODataResponse.getMetadata(response);
        this.entities = ODataResponse.getEntities(response);
        this.entity = this.entities.length === 0 ? ODataResponse.getEntity(response) : null;
    }


    /**
     * If contains multiple of single result
     *
     * @readonly
     * @type {boolean}
     * @memberof ODataResponse
     */
    public get containsMultipleEntities(): boolean {
        return this.entities.length > 0;
    }
}
