import TradePerson from "../Models/tradePerson.js";

export const fetchAllTradePersons = async (req, res) => {
  try {
    const persons = await TradePerson.find();
    res.status(200).json(persons);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
