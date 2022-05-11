import { db, firebase } from "../firebase";

export const openMusicRoomById = async ({ roomId }) => {
  try {
    const query = await db
      .collection("rooms")
      .where("roomId", "==", roomId)
      .get();

    await query.docs[0].ref.update({
      musicMode: true,
      musicInfo: {},
    });

    return { code: 200, message: "开启成功" };
  } catch (error) {
    return { code: 404, message: "开启失败" };
  }
};

export const closeMusicRoomById = async ({ roomId }) => {
  try {
    const query = await db
      .collection("rooms")
      .where("roomId", "==", roomId)
      .get();

    await query.docs[0].ref.update({
      musicMode: false,
      musicInfo: {},
    });

    return { code: 200, message: "关闭成功" };
  } catch (error) {
    return { code: 404, message: "关闭失败" };
  }
};

export const updateMusicRoomById = async ({ roomId, musicInfo }) => {
  try {
    const query = await db
      .collection("rooms")
      .where("roomId", "==", roomId)
      .get();

    await query.docs[0].ref.update({
      musicInfo,
    });

    return { code: 200, message: "更新成功" };
  } catch (error) {
    return { code: 404, message: "更新失败" };
  }
};
