import Auth from "../src/components/auth/Auth";
import Register from "../src/components/auth/Register";
import Container from "../src/components/Container";
import Navbar from "../src/components/nav/Navbar";
import AuthContext from "../src/context/AuthContext";
import getCurrentUser from "../src/actions/getCurrentUser";
import Header from "../src/components/Header";
import "../styles/globals.css";

// import getCurrentUser from "./src/actions/getCurrentUser";
// import Auth from "./src/components/auth/Auth";
// import Register from "./src/components/auth/Register";
// import Container from "./src/components/Container";
// import Navbar from "./src/components/nav/Navbar";
// import AuthContext from "./src/context/AuthContext";
// import "./styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const currentUser = await getCurrentUser();
  console.log(currentUser);
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <Container>
            {currentUser ? (
              <Navbar currentUser={currentUser} />
            ) : (
              <>
                <Header label="Login" />
                <Auth />
              </>
            )}

            {/* <Register /> */}
            {children}
          </Container>
          {/* </div> */}
        </AuthContext>
      </body>
    </html>
  );
}