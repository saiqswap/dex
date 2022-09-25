import { Facebook, Instagram, Telegram, Twitter } from "@mui/icons-material";
import { Box, IconButton, Link } from "@mui/material";

const socials = [
  {
    icon: <Facebook fontSize="small" />,
    link: "https://www.facebook.com/InfinityAngel.io/",
  },
  {
    icon: <Twitter fontSize="small" />,
    link: "https://twitter.com/InfinityAngelio",
  },
  {
    icon: <Instagram fontSize="small" />,
    link: "https://www.instagram.com/infinity_angel_official/",
  },
  {
    icon: <Telegram fontSize="small" />,
    link: "https://t.me/infinityangel_global",
  },
];

export const SocialComponent = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        " button": {
          minWidth: "unset",
        },
      }}
    >
      {socials.map((s, index) => (
        <IconButton component={Link} href={s.link} target="_blank" key={index}>
          {s.icon}
        </IconButton>
      ))}
    </Box>
  );
};
