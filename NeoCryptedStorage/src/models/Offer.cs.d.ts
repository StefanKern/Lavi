declare module server {
	interface offer {
		encryptedFileUploadId: number;
		creatorAddressHash: string;
		offererAddress: string;
		decryptedFileHash: string;
		encryptedFileHash: string;
		price?: number;
		avalibeTimeInBlocks?: number;
		time?: Date;
	}
}
