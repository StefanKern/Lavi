declare module server {
  interface offerandfile {
    title: string;
    /** date is encrypted with the password */
    encryptedData: string;
    /** password is encrypted with the users WIF */
    encryptedPassword: string;
    mimeType: string;
    uploader: string;
    uploadTime?: Date;
    decryptedFileHash: string;
    encryptedFileHash: string;
    encryptedFileUploadId: number;
    creatorAddressHash: string;
    offererAddress: string;
    time?: Date;
    /** buy an offer */
    open: boolean;
    buyerAddressHash?: string;
    granted: boolean;
    passwordSharedSecretEncrypted?: string;
  }
}
