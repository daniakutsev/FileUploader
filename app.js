import {initializeApp} from "firebase/app";
import {getStorage, ref, uploadBytesResumable} from "firebase/storage";
import {upload} from './upload.js'


const firebaseConfig = {
    apiKey: "AIzaSyAHrxaeQGiMFVCmpfbEAOGRCAKypNwxKaw",
    authDomain: "fileuploader-c8b98.firebaseapp.com",
    projectId: "fileuploader-c8b98",
    storageBucket: "fileuploader-c8b98.appspot.com",
    messagingSenderId: "466306217709",
    appId: "1:466306217709:web:7a230d54b68868da15bee4"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app, 'fileuploader-c8b98.appspot.com')

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const storageRef = ref(storage, `images/${file.name}`)


            uploadBytesResumable(storageRef, file).then((snapshot) => {
                console.log(snapshot)
                console.log(snapshot.metadata.size)
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
                const block = blocks[index].querySelector('.preview-info-progress')
                block.textContent = percentage
                block.style.width = percentage
            }, error => {
                console.log(error)
            }, () => {
                snapshot.ref.getDownloadURL().then(url => {
                    console.log('Download URL', url)
                })
            })
        })
    }
})