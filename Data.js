export let data = {
  currency: {
    glucose: 20,
    sunpower: 30,
    oxygen: 10,
    leaf: 30,
  },
  completedMissions: [],
  plants: [
    {
      name: "Bokchoy",
      image: "./Assets/Gallery/bokchoy.png",
      locked: false,
      stats: {
        HP: 200,
        ATK: 20,
        Range: 10,
        level: 1,
      },
    },
    {
      name: "Sunflower",
      image: "./Assets/Gallery/sunflower.png",
      locked: false,
      stats: {
        HP: 200,
        ATK: 20,
        Range: 10,
        level: 1,
      },
    },
    {
      name: "Tulip",
      image: "./Assets/Gallery/tulip.png",
      locked: false,
      stats: {
        HP: 200,
        ATK: 20,
        Range: 10,
        level: 1,
      },
    },
    {
      name: "Tulip",
      image: "",
      locked: true,
      stats: {
        HP: 200,
        ATK: 20,
        Range: 10,
        level: 1,
      },
    },
  ],
};
