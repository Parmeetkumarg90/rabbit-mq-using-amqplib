import { IsDate, IsString } from "class-validator";

export default class EventCreationDto {
    @IsString()
    event_type: string;

    @IsDate()
    created_at: Date;
}