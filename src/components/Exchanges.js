import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { server } from "./constants";

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
import { wrap } from "framer-motion";
const Exchanges = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoding] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    fetchExchanges();
  }, []);
  async function fetchExchanges() {
    try {
      const { data } = await axios.get(`${server}/exchanges`);
      setExchanges(data);
      setLoding(false);
    } catch (error) {
      setLoding(false);
      setError(true);
    }
  }
  if (error) return <ErrorComponent msg={"Error while fetching exchanges"} />; // in case of error load this component
  return (
    <Container maxW="container.xl">
      {loading ? (
        <Loader />
      ) : (
        <>
          <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
            {exchanges.map((i) => {
              return (
                <ExchangeCard
                  key={i.id}
                  name={i.name}
                  img={i.image}
                  rank={i.trust_score_rank}
                  url={i.url}
                />
              );
            })}
          </HStack>
        </>
      )}
    </Container>
  );
};

export default Exchanges;

const ExchangeCard = ({ name, img, rank, url }) => {
  return (
    <a href={url} target={"_blank"}>
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
          {rank}
        </Heading>
        <Text noOfLines={1}>{name}</Text>
      </VStack>
    </a>
  );
};
