import "./Register.scss";

import { Helmet } from "react-helmet";
import { Grid } from "@unioncredit/ui";

import { RegisterStep } from "components/register/RegisterStep";

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title>Register | Union Credit Protocol</title>
      </Helmet>
      <Grid className="Register">
        <Grid.Row justify="center">
          <Grid.Col xs={11} md={8.1} className="Register__col">
            <img src="/images/union.gif" alt="Union Logo" className="union-gif" />
          </Grid.Col>
        </Grid.Row>
        <Grid.Row justify="center">
          <Grid.Col xs={11} md={8.1} className="Register__col">
            <RegisterStep />
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </>
  );
}
