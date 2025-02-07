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

  public isBaseSepolia(): boolean {
    return this.getName() === "base-sepolia" || this.getChainId() === 84532 || this.getHex() === "0x14a34";
  }
}
