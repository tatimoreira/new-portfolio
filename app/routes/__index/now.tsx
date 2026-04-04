import { motion } from "framer-motion";
import SubtitleText from "~/components/SubtitleText/SubtitleText";

const CREATED_DATE = "April 2026";
const UPDATED_DATE = "April 4, 2026";

const working = [
  "Adding content and features to my personal site.",
  "Learning about The IndieWeb.",
  "Learning to type faster without looking at the keyboard (it has always been something that makes me feel insecure and puts me at a disadvantage).",
  "Actively looking for a job — trying to stay positive in this really hard stage of the industry.",
  "Studying new vocabulary on my daughter's Chinese cartoons."
];

const consuming = [
  "Listening again to progressive rock."
];

export default function Now() {
  return (
    <motion.div
      className="justify-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ease: [0, 0.71, 0.2, 1.01], duration: 0.8, delay: 0.5 }}
    >
      <div className="grid">
        <div className="relative max-w-2xl sm:mt-0 mt-10 overflow-hidden rounded-2xl p-8 shadow-xl border-4 border-sub-color">
          <div className="relative">
            <SubtitleText>Now</SubtitleText>
            <hr className="border-gray-500 dark:border-neutral-500 mb-4" />

            <p className="font-work text-sm font-light text-text-color mb-6">
              This is a{" "}
              <a
                href="https://sive.rs/nowff"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f5b1cc] underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                Now page
              </a>
              {" "}— a snapshot of what I'm focused on at this point in my life.
              <br />
              <span className="opacity-60">Created: {CREATED_DATE} · Updated: {UPDATED_DATE}</span>
            </p>

            <section className="mb-6">
              <h3 className="font-work text-xl font-bold text-sub-color mb-3">
                What I'm Currently Working On / Learning
              </h3>
              <ul className="space-y-2">
                {working.map((item) => (
                  <li
                    key={item}
                    className="font-work text-lg font-extralight text-text-color  flex gap-2"
                  >
                    <span className="text-sub-color mt-1 shrink-0">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="font-work text-xl font-bold text-sub-color mb-3">
                What I'm Recently Reading / Watching / Listening To
              </h3>
              <ul className="space-y-2">
                {consuming.map((item) => (
                  <li
                    key={item}
                    className="font-work text-lg font-extralight text-text-color  flex gap-2"
                  >
                    <span className="text-sub-color mt-1 shrink-0">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
