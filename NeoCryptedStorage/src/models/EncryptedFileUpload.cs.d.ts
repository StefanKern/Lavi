declare module server {
	interface encryptedFileUpload {
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
	}
}
