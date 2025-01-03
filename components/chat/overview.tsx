import { motion } from "framer-motion";

import { Logo } from "@/components/icons";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="mx-auto max-w-3xl md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex max-w-xl flex-col gap-8 rounded-xl p-6 text-center leading-relaxed">
        <p className="flex flex-row items-center justify-center gap-4">
          <Logo />
        </p>
        <p>
          您好，我是由 {process.env.NEXT_PUBLIC_APP_NAME}{" "}
          开发的聊天机器人，请在此输入您的问题，我将尽力为您解答
        </p>
      </div>
    </motion.div>
  );
};
