import {ValueObjectTypeOptions } from "@/app/types/Index";

export default class Base {
  /**
   * **** Need to overwrite this method ****
   *
   * - resource must have at least id, name, and label
   * - resource can have additonal fields, if necessary
   * - `id` should be number and unique (identifier)
   * - `name` should be string and unique (string identifier)
   * - `label` is string for human's readability (no need to unique)
   * - additional field can be string, number, or boolean
   *
   * @returns
   */
  public static getResourceArray(): {
    [key: string]: string | number | boolean;
  }[] {
    return [];
  }

  public static all<T extends Base>(): T[] {
    const resources: { [key: string]: string | number | boolean }[] = this.getResourceArray();
    const values: T[] = [];
    resources.forEach((resource) => {
      const value: T = this.fromId(resource.id as number);
      values.push(value);
    });
    return values;
  }

  public isUnknown(): boolean {
    return this.getName() === "unknown";
  }

  public static getUnknown<T extends Base>(): T {
    return new this({
      id: 0,
      name: "unknown",
      label: "---",
    }) as T;
  }

  public static fromId<T extends Base>(id: number): T {
    const resourceOf = this._idToResource();
    if (resourceOf[id] === undefined) {
      return this.getUnknown();
    }
    const resource = resourceOf[id];
    return new this(resource) as T;
  }

  public static fromName<T extends Base>(name: string): T {
    const resourceOf = this._nameToResource();
    if (resourceOf[name] === undefined) {
      return this.getUnknown();
    }
    const resource = resourceOf[name];
    return new this(resource) as T;
  }

  public static fromUniqueProperty<T extends Base>(
    uniqueFieldName: string,
    uniqueFieldValue: string | number,
  ): T {
    const resourceOf = this._uniquePropertyToResource(uniqueFieldName);
    if (resourceOf[uniqueFieldValue] === undefined) {
      return this.getUnknown();
    }
    const resource = resourceOf[uniqueFieldValue];
    return new this(resource) as T;
  }

  public static isValidId(id: number): boolean {
    const resourceOf = this._idToResource();
    return resourceOf[id] !== undefined;
  }

  public static isValidName(name: string): boolean {
    const resourceOf = this._nameToResource();
    return resourceOf[name] !== undefined;
  }

  public static idToNameMap(): { [key: number]: string } {
    const keyValues: { [key: number]: string } = {};
    this.getResourceArray().forEach((resource) => {
      if (resource["id"] !== undefined && resource["name"] !== undefined) {
        keyValues[resource["id"] as number] = resource["name"] as string;
      }
    });
    return keyValues;
  }

  public static idToLabelMap(): { [key: number]: string } {
    const keyValues: { [key: number]: string } = {};
    this.getResourceArray().forEach((resource) => {
      if (resource["id"] !== undefined && resource["label"] !== undefined) {
        keyValues[resource["id"] as number] = resource["label"] as string;
      }
    });
    return keyValues;
  }

  public static nameToLabelMap(): { [key: string]: string } {
    const keyValues: { [key: string]: string } = {};
    this.getResourceArray().forEach((resource) => {
      if (resource["name"] !== undefined && resource["label"] !== undefined) {
        keyValues[resource["name"] as string] = resource["label"] as string;
      }
    });
    return keyValues;
  }

  protected static _idToResource(): {
    [key: number]: { [key: string]: string | number | boolean };
  } {
    const resources = this.getResourceArray();
    const idToResource: {
      [key: number]: { [key: string]: string | number | boolean };
    } = {};
    resources.forEach((resource) => {
      const id = resource["id"] as number;
      idToResource[id] = resource;
    });
    return idToResource;
  }

  protected static _nameToResource(): {
    [key: string]: { [key: string]: string | number | boolean };
  } {
    const resources = this.getResourceArray();
    const nameToResource: {
      [key: string]: { [key: string]: string | number | boolean };
    } = {};
    resources.forEach((resource) => {
      const name = resource["name"] as string;
      nameToResource[name] = resource;
    });
    return nameToResource;
  }

  protected static _uniquePropertyToResource(uniqueProperty: string): {
    [key: string]: { [key: string]: string | number | boolean };
  } {
    const resources = this.getResourceArray();
    const uniquePropertyToResource: {
      [key: string]: { [key: string]: string | number | boolean };
    } = {};
    resources.forEach((resource) => {
      const property = resource[uniqueProperty] as string;
      uniquePropertyToResource[property] = resource;
    });
    return uniquePropertyToResource;
  }

  protected resource: { [key: string]: string | number | boolean };

  public constructor(resource: { [key: string]: string | number | boolean }) {
    this.resource = resource;
  }

  public getId(): number {
    return this.resource["id"] as number;
  }

  public getName(): string {
    return this.resource["name"] as string;
  }

  public getLabel(): string {
    return this.resource["label"] as string;
  }

  public equalsTo<T extends Base>(other: T): boolean {
    return this.getId() === other.getId();
  }

  public toJson(): ValueObjectTypeOptions {
    return {
      id: this.getId(),
      name: this.getName(),
      label: this.getLabel(),
      chainId: this.resource["chainId"] as number,
      hex: this.resource["hex"] as string
    };
  }
}
