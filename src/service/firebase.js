import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage"

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
});

const db = firebase.firestore();
const storage = firebase.storage();

export const initGet = async() => {
  const post = await db.collection("posts")
  .orderBy("date", "desc");


  return post.get().then((snapShot) => {
    let cards = [];
    snapShot.forEach((doc) => {

      console.log(doc);
      console.log(doc.data());

      cards.push({
        id: doc.id,
        title: doc.data().title,
        mvURL: doc.data().mvURL,
        text: doc.data().text,
        date: doc.data().date,
        tags: doc.data().tags,
        materials: doc.data().materials,
      })
    })

    return cards;
  })
}

export const getCollectionById = async (postId) => {
  try {
    const documentRef = db.collection("posts").doc(postId);
    const doc = await documentRef.get();
    if (doc.exists) {
      let documentData = {
        id: doc.id,
        title: doc.data().title,
        mvURL: doc.data().mvURL,
        text: doc.data().text,
        date: doc.data().date,
        tags: doc.data().tags,
        materials: doc.data().materials,
      };
      return documentData;
    } else {
      // ドキュメントが存在しない場合の処理
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};


export const getStep = async(id) => {
  const step = await db.collection("posts").doc(id).collection("step")
  .orderBy("step", "asc");

  return step.get().then((snapShot) => {
    let steps = [];
    snapShot.forEach((doc) => {
      // console.log(steps, steps);

      steps.push({
        id: doc.id,
        imgURL: doc.data().imgURL,
        step: doc.data().step,
        note: doc.data().note,
      })
    })

    return steps;
  })
}

export const addPostAsync = async(id, title, mvURL, description, tags, materials) => {
  let date = new Date();
  // 'posts'というコレクションにデータを追加
  await db.collection('posts').doc(id).set({
    title: title,
    mvURL: mvURL,
    text: description,
    date: date,
    tags: tags,
    materials: materials,
  });

  let postRef = db.collection('posts').doc(id);
  return postRef;
}

export const addStepAsync = async(id, step) => {
  const stepDoc = await db.collection("posts").doc(id).collection("step").add({
    step: step.step, // 連番のステップを設定
    note: step.note, // レシピステップのテキスト
    imgURL: step.imgURL, // 画像のファイル名
  });

  return stepDoc;
}

export const getMvURLAsync= async(id) => {
  const postId = id.postId;

  // Firestoreのコレクションとコレクションフォルダの参照を動的に設定
  const collectionFolderRef = storage.ref().child(`${postId}`);

  return collectionFolderRef;
}

export const appStepImageAsync = async(id, file, imgFileName) => {
  const collectionId = id.collectionId;

  // ストレージにファイルをアップロード
  const imgFileRef = storage.ref(`${collectionId}`).child(`step/${imgFileName}`);

  // ファイルを Firebase Storage にアップロード
  await imgFileRef.put(file);

  // アップロードが完了したら、ダウンロード URL を取得
  await imgFileRef.getDownloadURL();
}








