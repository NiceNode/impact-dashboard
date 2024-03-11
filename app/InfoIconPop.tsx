import {
  AccessibleIcon,
  IconButton,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
  Text,
} from "@radix-ui/themes";
import { Popover } from "@radix-ui/react-popover";
import { InfoCircledIcon } from "@radix-ui/react-icons";

const InfoIconPop = (props: { text: string }) => {
  return (
    <PopoverRoot>
      <PopoverTrigger>
        <IconButton variant="ghost" size="1" color="gray">
          <AccessibleIcon label="Prop description">
            <InfoCircledIcon />
          </AccessibleIcon>
        </IconButton>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        style={{ maxWidth: 350 }}
        className="radix-themes-custom-fonts"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          (event.currentTarget as HTMLElement)?.focus();
        }}
      >
        <Text as="div" size="2">
          {props.text}
        </Text>
      </PopoverContent>
    </PopoverRoot>
  );
};
export default InfoIconPop;
