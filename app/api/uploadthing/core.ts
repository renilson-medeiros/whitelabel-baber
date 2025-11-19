import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter  = {
    imageUploader: f({ image: { maxFileSize: "4MB" , maxFileCount: 1 } })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log('Upload complete for file:', file.url);
            
            return { url: file.url };
        }),
} satisfies FileRouter;

export type ourFileRouter  = typeof ourFileRouter ;