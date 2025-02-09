import Base from "@/app/utils/base";

export default class Chain extends Base {
  public static getResourceArray() {
    return [
      {
        id: 1,
        name: "base-sepolia",
        label: "Base Sepolia",
        chainId: 84532,
        hex: "0x14a34",
      },
      {
        id: 2,
        name: "base-mainnet",
        label: "Base",
        chainId: 8453,
        hex: "0x2105",
      }
    ];
  }

  public getChainId(): number {
    return this.resource["chainId"] as number;
  }

  public getHex(): string {
    return this.resource["hex"] as string;
  }

  public static baseSepolia(): Chain {
    return this.fromName("base-sepolia");
  }

  public static base(): Chain {
    return this.fromName("base");
  }

  public isBaseSepolia(): boolean {
    return this.getName() === "base-sepolia" || this.getChainId() === 84532 || this.getHex() === "0x14a34";
  }

  public isBase(): boolean {
    return this.getName() === "base" || this.getChainId() === 8453 || this.getHex() === "0x2105";
  }
}
