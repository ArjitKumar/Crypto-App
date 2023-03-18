import {
  Container,
  Box,
  VStack,
  StatLabel,
  StatNumber,
  Stat,
  StatHelpText,
  StatArrow,
  Badge,
  Progress,
  Button,
} from "@chakra-ui/react";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "./constants";
import { useParams } from "react-router-dom";
import ErrorComponent from "./ErrorComponent";
import { RadioGroup, Radio, Text, Image } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";
import Chart from "./Chart";

const CoinDetails = () => {
  const [coin, setCoin] = useState({});
  const [loading, setLoding] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState("inr");
  const [days, setDays] = useState("24h");
  const [charArray, setChartArray] = useState([]);
  const currencySymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  const { id } = useParams();

  const btns = ["24h", "7d", "14d", "30d", "60d", "200d", "365d", "max"];

  const switchChartStats = (key) => {
    switch (key) {
      case "24h":
        setDays("24h");
        setLoding(true);
        break;
      case "7d":
        setDays("7d");
        setLoding(true);
        break;
      case "14d":
        setDays("14d");
        setLoding(true);
        break;
      case "30d":
        setDays("30d");
        setLoding(true);
        break;
      case "60d":
        setDays("60d");
        setLoding(true);
        break;
      case "200d":
        setDays("200d");
        setLoding(true);
        break;
      case "365d":
        setDays("365d");
        setLoding(true);
        break;
      case "max":
        setDays("max");
        setLoding(true);
        break;
      default:
        setDays("24h");
        setLoding(true);
        break;
    }
  };
  useEffect(() => {
    fetchCoin();
  }, [id, currency, days]);
  async function fetchCoin() {
    try {
      const { data } = await axios.get(`${server}/coins/${id}`);
      const { data: chartData } = await axios.get(
        `${server}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`
      );
      setCoin(data);
      setChartArray(chartData.prices);
      setLoding(false);
    } catch (error) {
      setLoding(false);
      setError(true);
    }
  }
  if (error) return <ErrorComponent msg={"Error while fetching coin"} />;
  return (
    <Container maxW={"container.lg"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box width={"full"} borderWidth={"1"}>
            <Chart arr={charArray} currency={currencySymbol} days={days} />
          </Box>

          <HStack p="4" overflow={"auto"}>
            {btns.map((i) => (
              <Button key={i} onClick={() => switchChartStats(i)}>
                {i}
              </Button>
            ))}
          </HStack>
          <RadioGroup value={currency} onChange={setCurrency}>
            <HStack spacing={"4"} justifyContent="center">
              <Radio value={"inr"}>INR</Radio>
              <Radio value={"usd"}>USD</Radio>
              <Radio value={"eur"}>EUR</Radio>
            </HStack>
          </RadioGroup>

          <VStack spacing={"4"} p={"16"} alignItems={"flex-start"}>
            <Text fontSize={"small"} alignItems={"center"} opacity={0.7}>
              {" "}
              Last Updated on{" "}
              {Date(coin.market_data.last_updated).split("G")[0]}
            </Text>
            <Image
              src={coin.image.large}
              w={"16"}
              h={"16"}
              objectFit={"contain"}
            ></Image>
            <Stat>
              <StatLabel>{coin.name}</StatLabel>
              <StatNumber>
                {currencySymbol}
                {coin.market_data.current_price[currency]}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={
                    coin.market_data.price_change_percentage_24h > 0
                      ? "increase"
                      : "decrease"
                  }
                />
                {coin.market_data.price_change_percentage_24h}%
              </StatHelpText>
            </Stat>
            <Badge fontSize={"2xl"} bgColor={"blackAlpha.800"} color={"white"}>
              {"#" + coin.market_cap_rank}
            </Badge>

            <CustomBar
              high={`${currencySymbol}${coin.market_data.high_24h[currency]}`}
              low={`${currencySymbol}${coin.market_data.low_24h[currency]}`}
            />

            <Box w={"full"} p="4">
              <Item title={"Max Supply"} value={coin.market_data.max_supply} />
              <Item
                title={"Circulating Supply"}
                value={coin.market_data.circulating_supply}
              />
              <Item
                title={"Market Cap"}
                value={currencySymbol + coin.market_data.market_cap[currency]}
              />
              <Item
                title={"All Time Low"}
                value={coin.market_data.atl[currency]}
              />
              <Item
                title={"All Time High"}
                value={coin.market_data.ath[currency]}
              />
            </Box>
          </VStack>
        </>
      )}
    </Container>
  );
};

const Item = ({ title, value }) => {
  return (
    <HStack justifyContent={"space-between"} w={"full"} my={"4"}>
      <Text fontFamily={"Bebas Neue"} letterSpacing={"widest"}>
        {title}
      </Text>
      <Text>{value}</Text>
    </HStack>
  );
};
const CustomBar = ({ high, low }) => {
  // <VStack w={"full"}>
  return (
    <div>
      <Progress value={"50"} colorScheme={"teal"} />
      <HStack justifyContent={"space-between"} w={"full"}>
        <Badge children={low} colorScheme={"red"} />
        <Text fontSize={"sm"}>24H Range</Text>
        <Badge children={high} colorScheme={"green"} />
      </HStack>
      {/* // </VStack>; */}
    </div>
  );
};
export default CoinDetails;
