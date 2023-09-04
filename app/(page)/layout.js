import Auth from "../src/components/auth/Auth";
import Register from "../src/components/auth/Register";
import Container from "../src/components/Container";
import Navbar from "../src/components/nav/Navbar";
import AuthContext from "../src/context/AuthContext";
import getCurrentUser from "../src/actions/getCurrentUser";
import Header from "../src/components/Header";
import "../styles/globals.css";

export const metadata = {
  title: "HMA Dashboard",
  description: "Dashboard",
};

export default async function RootLayout({ children }) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body>
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
