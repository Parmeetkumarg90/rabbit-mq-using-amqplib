import { CommandFactory } from "nest-commander";
import ProcessorCliModule from "./processor-cli.module";

async function bootstrap() {
    try {
        await CommandFactory.runWithoutClosing(ProcessorCliModule, ["debug", "error", "fatal", "log", "verbose", "warn"]);
    }
    catch (e) {
        console.log("Error in bootstrapping processor: ", e);
        process.exit(1);
    }
}

bootstrap();