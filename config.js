const token = "YOUR TOKEN HERE!";
const waterMarkList = [
  {
    text: "طوطی 🦜",
    address: "/template/parrot.png",
  },
  {
    text: "ربات 🤖",
    address: "/template/robot.png",
  },
  {
    text: "خانه 🏠",
    address: "/template/home.png",
  },
];

module.exports.getToke=()=>{
  return token
}
module.exports.inline_keyBoard = async (type, dst) => {
  let tmp = [];
  waterMarkList.forEach((item, index) => {
    tmp.push([
      {
        text: item.text,
        callback_data: `${type}@@${index}@@${dst}`,
      },
    ]);
  });
  return {
    inline_keyboard: tmp,
  };
};
module.exports.getWarteMark = async (id)=>{
  return waterMarkList[id].address
}