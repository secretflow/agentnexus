import {
  Apple,
  Chrome,
  Desktop,
  GamingConsole,
  MobilePhone,
  Safari,
  TV,
  Tablet,
  Watch,
} from "@/components/icons";
import { BlurImage } from "@/components/layout";
import type { DeviceTabs } from "./types";

export function DeviceIcon({
  display,
  tab,
  className,
}: {
  display: string;
  tab: DeviceTabs;
  className: string;
}) {
  if (tab === "device") {
    switch (display) {
      case "Desktop":
        return <Desktop className={className} />;
      case "Mobile":
        return <MobilePhone className={className} />;
      case "Tablet":
        return <Tablet className={className} />;
      case "Wearable":
        return <Watch className={className} />;
      case "Console":
        return <GamingConsole className={className} />;
      case "Smarttv":
        return <TV className={className} />;
      default:
        return <Desktop className={className} />;
    }
  } else if (tab === "browser") {
    if (display === "Chrome") {
      return <Chrome className={className} />;
    } else if (display === "Safari" || display === "Mobile Safari") {
      return <Safari className={className} />;
    } else {
      return (
        <BlurImage
          src={`https://faisalman.github.io/ua-parser-js/images/browsers/${display.toLowerCase()}.png`}
          alt={display}
          width={20}
          height={20}
          className={className}
        />
      );
    }
  } else if (tab === "os") {
    if (display === "Mac OS") {
      return (
        <BlurImage
          src="https://assets.dub.co/misc/icons/macos.png"
          alt={display}
          width={20}
          height={20}
          className="h-4 w-4"
        />
      );
    } else if (display === "iOS") {
      return <Apple className="-ml-1 h-5 w-5" />;
    } else {
      return (
        <BlurImage
          src={`https://faisalman.github.io/ua-parser-js/images/os/${display.toLowerCase()}.png`}
          alt={display}
          width={30}
          height={20}
          className="h-4 w-5"
        />
      );
    }
  } else {
    return (
      <BlurImage
        src={`https://faisalman.github.io/ua-parser-js/images/companies/default.png`}
        alt={display}
        width={20}
        height={20}
        className={className}
      />
    );
  }
}
