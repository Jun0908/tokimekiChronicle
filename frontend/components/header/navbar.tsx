import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NextLink from "next/link";

function Navbar() {
  const flexStyle: React.CSSProperties = {
    padding: "1.5em 0.5em",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    boxSizing: "border-box",
  };

  const boxStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
  };

  const textStyle: React.CSSProperties = {
    marginLeft: "1em",
    fontSize: "1.25em",
    fontWeight: "bold",
  };

  // Update this style to left-align the links:
  const linkContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start", // left-align
    flex: 1,
    marginLeft: "1em",
    //marginRight: "0.5em",
    gap: "1em", // adds spacing between links
  };

  const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "inherit",
  };

  return (
    <div style={flexStyle}>
      {/* Logo */}
      <div style={boxStyle}>
        <img src="wasapi.jpg" alt="Logo" width={50} height={50} />
        
      </div>

      {/* Links */}
      <div style={linkContainerStyle}>
        <NextLink href="/map" passHref legacyBehavior>
          <a style={linkStyle}>Map</a>
        </NextLink>
        <NextLink href="/talk" passHref legacyBehavior>
          <a style={linkStyle}>Talk</a>
        </NextLink>
        <NextLink href="/myAsset" passHref legacyBehavior>
          <a style={linkStyle}>Album</a>
        </NextLink>
      </div>

      {/* Connect Button */}
      <ConnectButton />
    </div>
  );
}

export default Navbar;

