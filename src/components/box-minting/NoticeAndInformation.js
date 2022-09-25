import { Box, Divider, Typography } from "@mui/material";
import { useSelector } from "react-redux";

export const NoticeAndInformation = () => {
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  return (
    <>
      <Divider sx={{ margin: "1rem 0px" }} />
      <Box textAlign="left" padding="1rem 2rem">
        <Typography variant="h6" mt={2} color="primary">
          NOTICE
        </Typography>
        <ul style={{ marginLeft: "1rem", listStyle: "inside" }}>
          <li>{`${library.MINTING_FORM_NOTICE_1}.`}</li>
          <li>{`${library.MINTING_FORM_NOTICE_2}.`}</li>
          <li>{`${library.MINTING_FORM_NOTICE_3}.`}</li>
        </ul>
        <Typography variant="h6" mt={2} color="primary">
          INFORMATION
        </Typography>
        <Typography mt={1}>What is Infinity Angel?</Typography>
        <Typography variant="inherit" mt={1} mb={1}>
          Infinity Angel is an AA game, with the playing genre is the horizontal
          screen MOBA focusing on PVP and E-sport in addition to the PVE game
          mode of the Endless RPG genre. With a diverse costume system of more
          than 100 sets of each characters and minions, besides the variety of
          tactics that can be combined from the passive skills of the
          skin/minion is a highlight of the game.
        </Typography>
        <Typography variant="inherit">
          Any user from individual to business can easily to buy, sell and trade
          their NFT. In the beautiful 3D Infinity Angel graphics world, players
          can use their NFT Angels in a variety of ways, from equipping them
          with powerful weapons or unique outfits in fiery, competitive battles
          with each other to get NFT items that can be exchanged and traded
          according to P2E criteria.
        </Typography>
      </Box>
    </>
  );
};
