import { db, firebase } from "../firebase";

export const createRoom = async ({ roomId, name, user }) => {
  try {
    const query = await db
      .collection("rooms")
      .where("roomId", "==", roomId)
      .get();

    if (query.size > 0) {
      return { code: 404, message: "房间已存在" };
    }

    const doc = await db.collection("rooms").add({
      roomId,
      name,
      creator: user.uid,
      isPublic: false,
      createTime: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await doc.collection("members").add({
      isHost: true,
      isAdmin: true,
      user,
      createTime: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await doc.collection("messages").add({
      text: `${user.displayName} 创建了聊天室。 开始交流吧！`,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      system: true,
    });

    return { code: 200, message: "创建成功" };
  } catch (error) {
    return { code: 404, message: "创建失败" };
  }
};

export const joinRoomById = async ({ roomId, user }) => {
  try {
    const query = await db
      .collection("rooms")
      .where("roomId", "==", roomId)
      .get();

    if (query.size === 0) {
      return { code: 404, message: "房间不存在" };
    }

    if (query.docs[0].data().isClosed) {
      return { code: 404, message: "房间禁止外部成员加入" };
    }

    const memberRef = query.docs[0].ref.collection("members");

    const memberQuery = await memberRef.where("user.uid", "==", user.uid).get();

    if (memberQuery.size === 0) {
      await memberRef.add({
        isHost: false,
        isAdmin: false,
        user,
        createTime: firebase.firestore.FieldValue.serverTimestamp(),
      });

      await query.docs[0].ref.collection("messages").add({
        text: `${user.displayName} 加入聊天室！`,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        system: true,
      });
    } else {
      return { code: 200, message: "加入成功" };
    }

    return { code: 200, message: "加入成功" };
  } catch (error) {
    return { code: 404, message: "加入失败" };
  }
};

export const getRoomList = async ({ user }) => {
  try {
    const query = await db
      .collectionGroup("members")
      .where("user.uid", "==", user.uid)
      .get();

    let roomList = [];

    for (const doc of query.docs) {
      const result = await doc.ref.parent.parent.get();

      const memberQuery = await result.ref.collection("members").get();

      // Alternative way to detect deleted room
      if (result.data()) {
        roomList.push({
          ...result.data(),
          memberNum: memberQuery.size,
          id: result.id,
        });
      }
    }

    return { code: 200, message: "获取成功", data: roomList };
  } catch (error) {
    console.log(error);
    return { code: 404, message: "获取失败" };
  }
};

export const getRoomInfoById = async ({ roomId }) => {
  try {
    const query = await db
      .collection("rooms")
      .where("roomId", "==", roomId)
      .get();

    if (query.size === 0) {
      return { code: 404, message: "房间不存在" };
    }

    const doc = query.docs[0];

    const memberQuery = await query.docs[0].ref.collection("members").get();

    const result = await doc.ref.get();

    return {
      code: 200,
      message: "获取成功",
      data: { ...result.data(), memberNum: memberQuery.size },
    };
  } catch (error) {
    console.log(error);
    return { code: 404, message: "获取失败" };
  }
};

export const updateRoomStatusByRoomId = async ({
  roomId,
  isClosed,
  creator,
}) => {
  try {
    const query = await db
      .collection("rooms")
      .where("roomId", "==", roomId)
      .get();

    if (query.size === 0) {
      return { code: 404, message: "房间不存在" };
    }

    await query.docs[0].ref.update({
      ...(typeof isClosed !== "undefined" ? { isClosed } : {}),
      ...(creator ? { creator } : {}),
    });

    return {
      code: 200,
      message: "状态切换成功",
    };
  } catch (error) {
    console.log(error);
    return { code: 404, message: "状态切换失败" };
  }
};

export const updateRoomAuthByUserId = async ({ roomId, userId, isHost }) => {
  try {
    const query = await db
      .collection("rooms")
      .where("roomId", "==", roomId)
      .get();

    if (query.size === 0) {
      return { code: 404, message: "房间不存在" };
    }

    const memberRef = query.docs[0].ref.collection("members");
    const userQuery = await memberRef.where("user.uid", "==", userId).get();

    if (userQuery.size > 0) {
      await userQuery.docs[0].ref.update({ isHost });
    } else {
      return { code: 404, message: "用户不在此聊天室中" };
    }

    return {
      code: 200,
      message: "更新成功",
    };
  } catch (error) {
    console.log(error);
    return { code: 404, message: "更新失败" };
  }
};

export const leaveRoomByUserId = async ({ roomId, user }) => {
  try {
    const query = await db
      .collection("rooms")
      .where("roomId", "==", roomId)
      .get();

    if (query.size === 0) {
      return { code: 404, message: "房间不存在" };
    }

    const memberRef = query.docs[0].ref.collection("members");
    const userQuery = await memberRef.where("user.uid", "==", user.uid).get();

    if (userQuery.size > 0) {
      await userQuery.docs[0].ref.delete();
    }

    await query.docs[0].ref.collection("messages").add({
      text: `${user.displayName} 离开聊天室！`,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      system: true,
    });

    return {
      code: 200,
      message: "退出成功",
    };
  } catch (error) {
    console.log(error);
    return { code: 404, message: "退出失败" };
  }
};

export const deleteRoomByRoomId = async ({ roomId }) => {
  try {
    const query = await db
      .collection("rooms")
      .where("roomId", "==", roomId)
      .get();

    if (query.size === 0) {
      return { code: 404, message: "房间不存在" };
    }

    await query.docs[0].ref.delete();

    return {
      code: 200,
      message: "关闭成功",
    };
  } catch (error) {
    console.log(error);
    return { code: 404, message: "关闭失败" };
  }
};
