declare module neo {
    interface invocationObject {
        scriptHash: string,
        operation: string,
        arg1: any,
        arg2: any,
        assetType: any,
        assetAmount: any
    }
}