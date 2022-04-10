import { db, firebase } from "../firebase";

export const insertMessage = async ({ roomId, user, messages }) => {
  try {
    const query = await db
      .collection("rooms")
      .where("roomId", "==", roomId)
      .get();

    const _message = { ...messages[0] };

    delete _message._id;

    await query.docs[0].ref.collection("messages").add({
      ..._message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      user: {
        _id: user.uid,
        name: user.displayName,
      },
    });

    return { code: 200, message: "插入成功" };
  } catch (error) {
    console.log(error);
    return { code: 404, message: "插入失败" };
  }
};

export const getEarlyMessagesById = async ({ roomId }) => {
  try {
    const query = await db
      .collection("rooms")
      .where("roomId", "==", roomId)
      .get();

    const subQuery = await query.docs[0].ref
      .collection("messages")
      .orderBy("createdAt", "desc")
      .get();

    let data = [];

    for (const doc of subQuery.docs) {
      data.push({
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        _id: doc.id,
      });
    }

    return { code: 200, message: "获取成功", data };
  } catch (error) {
    console.log(error);
    return { code: 404, message: "获取失败" };
  }
};
