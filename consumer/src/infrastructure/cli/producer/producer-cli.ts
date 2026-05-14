import { CommandFactory } from "nest-commander";
import ProducerCliModule from "./producer-cli.module";

async function bootstrap() {
    try {
        await CommandFactory.run(ProducerCliModule, ["debug", "error", "fatal", "log", "verbose", "warn"]);
    }
    catch (e) {
        console.log("Error in bootstrapping producer: ", e);
        process.exit(1);
    }
    finally {
        process.exit(0);
    }
}

bootstrap();