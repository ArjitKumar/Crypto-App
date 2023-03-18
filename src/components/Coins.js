import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { server } from "./constants";
import { Link } from "react-router-dom";
// import { HStack, VStack, Button } from "@chakra-ui/react";
import { Button, Radio, RadioGroup } from "@chakra-ui/react";

import ErrorComponent from "./ErrorComponent";
import {
  Container,
  HStack,
  VStack,
  Image,
  Heading,
  Text,
} from "@chakra-ui/react";
import Loader from "./Loader";
const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoding] = useState(true);
  const [error, setError] = useState(false);
  const [page, setpage] = useState(1);
  const [currency, setCurrency] = useState("inr");

  const currencySymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  const changePage = (page) => {
    setpage(page);
    setLoding(true);
  };

  const btns = new Array(132).fill(1);

  useEffect(() => {
    fetchCoin();
  }, [currency, page]);
  async function fetchCoin() {
    try {
      const { data } = await axios.get(
        `${server}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=${page}&sparkline=false`
      );
      setCoins(data);
      setLoding(false);
    } catch (error) {
      setLoding(false);
      setError(true);
    }
  }
  if (error) return <ErrorComponent msg={"Error while fetching coins"} />; // in case of error load this component
  return (
    <Container maxW="container.xl">
      {loading ? (
        <Loader />
      ) : (
        <>
          <RadioGroup value={currency} onChange={setCurrency}>
            <HStack spacing={"4"} justifyContent="center">
              <Radio value={"inr"}>INR</Radio>
              <Radio value={"usd"}>USD</Radio>
              <Radio value={"eur"}>EUR</Radio>
            </HStack>
          </RadioGroup>

          <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
            {coins.map((i) => {
              return (
                <ExchangeCard
                  id={i.id}
                  key={i.id}
                  name={i.name}
                  price={i.current_price}
                  img={i.image}
                  symbol={i.symbol}
                  currencySymbol={currencySymbol}
                />
              );
            })}
          </HStack>

          <HStack width={"80%"} overflowX={"auto"} p={"8"} ml="24">
            {btns.map((item, index) => (
              <Button
                key={index}
                bgColor={"blackAlpha.900"}
                color={"white"}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </HStack>
        </>
      )}
    </Container>
  );
};

const ExchangeCard = ({
  id,
  name,
  img,
  price,
  symbol,
  currencySymbol = "₹",
}) => {
  return (
    <Link to={`/coins/${id}`}>
      <VStack
        w={"52"}
        shadow={"lg"}
        p={"8"}
        borderRadius={"lg"}
        transition={"all 0.3s"}
        m={"4"}
        css={{
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        <Image
          src={img}
          w={"10"}
          h={"10"}
          objectFit={"contain"}
          alt={"Exchange"}
        />
        <Heading size={"md"} noOfLines={1}>
          {symbol}
        </Heading>
        <Text noOfLines={1}>{name}</Text>
        <Text noOfLines={1}>{price ? `${currencySymbol}${price}` : "NA"}</Text>
      </VStack>
    </Link>
  );
};

export default Coins;
