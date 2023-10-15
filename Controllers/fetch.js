import TradePerson from "../Models/tradePerson.js";

export const fetchAllTradePersons = async (req, res) => {
  try {
    const persons = await TradePerson.find();
    res.status(200).json(persons);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}

export const fetchByTrades = async (req, res) => {
  try {
    const {trade}= req.params;
    console.log("fetch.js 15:",trade);
    const allTradePersons = await TradePerson.find();

    let requiredTradePersons = allTradePersons.filter((person)=>person.profession.includes(trade))
    console.log(requiredTradePersons);

    res.status(200).json(requiredTradePersons);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

