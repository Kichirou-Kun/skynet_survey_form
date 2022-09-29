import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";
import { channels, genres, times } from "../utils";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";

type FormValues = {
  name: string;
  phone: string;
  favChannel?: string;
  watchingTime?: string;
  favGenre?: string;
  dislikeChannel?: string;
  createdAt?: Date;
};
const steps = ["Fav Channel", "Watching Time", "Fav Genre", "Dislike Channel"];
const SkynetSurveyForm = () => {
  const [msg, setMsg] = useState<string>("");
  const [finished, setIsFinished] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);

  const {
    register,
    handleSubmit,
    getValues,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      phone: "",
      favChannel: "",
      watchingTime: "",
      favGenre: "",
      dislikeChannel: "",
      createdAt: new Date(Date.now()),
    },
  });

  const submitHandler = async ({
    name,
    phone,
    favChannel,
    watchingTime,
    favGenre,
    dislikeChannel,
    createdAt,
  }: FormValues) => {
    await addDoc(collection(db, "surveys"), {
      name,
      phone,
      favChannel,
      watchingTime,
      favGenre,
      dislikeChannel,
      createdAt,
    });
    reset();
    setIsFinished(true);
  };

  const nextStepHandler = () => {
    if ((step === 0 && !getValues("name")) || !getValues("phone")) {
      return showErrorMsg("အချက်အလက်များဖြည့်ပါ");
    }
    if (step === 1 && !getValues("favChannel")) {
      return showErrorMsg("အကြိုက်ဆုံး ချန်နယ် ရွေးချယ်ပါ");
    }
    if (step === 2 && !getValues("watchingTime")) {
      return showErrorMsg("အကြည့်များဆုံး အချိန် ရွေးချယ်ပါ");
    }
    if (step === 3 && !getValues("favGenre")) {
      return showErrorMsg("အကြည့်ဆုံး အစီအစဥ်ကို ရွေးချယ်ပါ");
    }
    if (step === 4) {
      return;
    }

    setStep((prev) => (prev += 1));
    setMsg("");
  };

  const getButtonText = (): string =>
    step === 0
      ? "စတင်မည်"
      : step === 4
      ? isSubmitting
        ? "ပေးပို့နေသည်..."
        : "ပေးပို့မည်"
      : "ရှေ့သို့";

  const showErrorMsg = (message: string) => {
    setMsg(message);
  };

  return (
    <>
      <div
        className={`max-w-md m-auto min-h-screen sm:px-6 px-6 flex flex-col justify-center items-center `}
      >
        <div
          className={`bg-boxColor rounded-lg shadow-md w-full  flex flex-col gap-4 relative p-4 ${
            finished && "py-8"
          }`}
        >
          <div className="flex justify-center flex-col  items-center gap-4 ">
            <img
              src="/logo/skynet_logo.png"
              alt=""
              className="w-[160px] h-[32px] object-contain"
            />

            {!finished && (
              <h1 className="text-lg tracking-wide text-textColor">
                မေးခွန်းလေးတွေ ဖြေကြမယ်
              </h1>
            )}
            {/* form stepper */}
            {step !== 0 && !finished && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-row mt-2 gap-4 items-center justify-center w-full"
              >
                {steps.map((stepper, index) => (
                  <p
                    key={stepper}
                    className={`${
                      step - 1 === index ? "bg-[#0CA5F5]" : "bg-bodyBg"
                    } sm:py-[2px] py-[2px] sm:px-8 px-6 bg-bodyBg rounded-full`}
                  />
                ))}
              </motion.div>
            )}

            {/* Error Message */}
            {<p className="text-red-800 tracking-wider font-bold">{msg}</p>}
          </div>

          {/* Form Submit section */}
          <>
            {finished ? (
              <div className="flex flex-col text-center justify-center items-center gap-4">
                <img
                  src="/logo/success-icon.png"
                  alt="success-icon"
                  className="w-10 h-10 object-contain"
                />
                <p className="text-xl font-bold text-mainColor">
                  ဖြေဆိုပေးသည့်အတွက် ကျေးဇူးတင်ပါသည်
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(submitHandler)}
                className="flex flex-col h-full gap-4 "
              >
                {step === 0 && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <input
                        {...register("name", {
                          maxLength: {
                            message: "Name is too long",
                            value: 255,
                          },
                          required: true,
                        })}
                        type="text"
                        placeholder="အမည်​"
                        className="outline-none border-2 border-bodyBg px-4 py-2 rounded-md"
                      />
                      {errors.name && (
                        <p className="text-red-800 font-semibold">{`${errors.name.message}`}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        {...register("phone", {
                          required: true,
                          minLength: {
                            value: 11,
                            message: "Invalid phone number",
                          },
                          maxLength: {
                            value: 11,
                            message: "Invalid phone number",
                          },
                        })}
                        type="tel"
                        placeholder="ဖုန်းနံပါတ်"
                        className="outline-none px-4 py-2 rounded-md border-2 border-bodyBg"
                      />
                      {errors.phone && (
                        <p className="text-red-800 font-semibold">{`${errors.phone.message}`}</p>
                      )}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <Controller
                    control={control}
                    name="favChannel"
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onBlur, onChange, value } }) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-2"
                      >
                        <h1 className="text-xl  py-2 text-mainColor font-bold">
                          ဘယ်ချန်နယ် အကြိုက်ဆုံးလဲ?​
                        </h1>
                        {channels.map((channel, index) => {
                          return (
                            <label
                              key={index}
                              className={`flex ${
                                channel.name === value
                                  ? "bg-bodyBg  font-semibold text-gray-800 "
                                  : null
                              } justify-between cursor-pointer flex-row shadow-sm py-2 px-4 border-2 border-bodyBg text-textColor select-none rounded-md`}
                            >
                              <h3>{channel.name}</h3>
                              <input
                                {...register("favChannel")}
                                type="radio"
                                name="radio-buttons-group"
                                onBlur={onBlur}
                                onChange={onChange}
                                value={channel.name}
                              />
                            </label>
                          );
                        })}
                      </motion.div>
                    )}
                  />
                )}

                {step === 2 && (
                  <Controller
                    control={control}
                    name="watchingTime"
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onBlur, onChange, value } }) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-2"
                      >
                        <h1 className="text-xl  py-2 text-mainColor font-bold">
                          ဘယ်အချိန် အများဆုံး ကြည့်ဖြစ်လဲ?​
                        </h1>
                        {times.map((time, index) => {
                          return (
                            <label
                              key={index}
                              className={`flex ${
                                time.name === value
                                  ? "bg-bodyBg  font-semibold text-gray-800 "
                                  : null
                              } justify-between cursor-pointer flex-row shadow-sm py-2 px-4 border-2 border-bodyBg text-textColor select-none rounded-md`}
                            >
                              <h3>{time.name}</h3>
                              <input
                                {...register("watchingTime")}
                                type="radio"
                                name="radio-buttons-group"
                                onBlur={onBlur}
                                onChange={onChange}
                                value={time.name}
                              />
                            </label>
                          );
                        })}
                      </motion.div>
                    )}
                  />
                )}

                {step === 3 && (
                  <Controller
                    control={control}
                    name="favGenre"
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onBlur, onChange, value } }) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-2"
                      >
                        <h1 className="text-xl  py-2 text-mainColor font-bold">
                          ဘယ်လိုအစီအစဥ်တွေ အကြိုက်ဆုံးလဲ?​​
                        </h1>
                        {genres.map((genre, index) => {
                          return (
                            <label
                              key={index}
                              className={`flex ${
                                genre.name === value
                                  ? "bg-bodyBg  font-semibold text-gray-800 "
                                  : null
                              } justify-between cursor-pointer flex-row shadow-sm py-2 px-4 border-2 border-bodyBg text-textColor select-none rounded-md`}
                            >
                              <h3>{genre.name}</h3>
                              <input
                                {...register("favGenre")}
                                type="radio"
                                name="radio-buttons-group"
                                onBlur={onBlur}
                                onChange={onChange}
                                value={genre.name}
                              />
                            </label>
                          );
                        })}
                      </motion.div>
                    )}
                  />
                )}

                {step === 4 && (
                  <Controller
                    control={control}
                    name="dislikeChannel"
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onBlur, onChange, value } }) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-2"
                      >
                        <h1 className="text-xl  py-2 text-mainColor font-bold">
                          အဘယ်ချန်နယ် အကြည့်​နည်းဆုံးလဲ?​
                        </h1>
                        {channels.map((channel, index) => {
                          return (
                            <label
                              key={index}
                              className={`flex ${
                                channel.name === value
                                  ? "bg-bodyBg  font-semibold text-gray-800 "
                                  : null
                              } justify-between cursor-pointer flex-row shadow-sm py-2 px-4 border-2 border-bodyBg text-textColor select-none rounded-md`}
                            >
                              <h3>{channel.name}</h3>
                              <input
                                {...register("dislikeChannel")}
                                type="radio"
                                name="radio-buttons-group"
                                onBlur={onBlur}
                                onChange={onChange}
                                value={channel.name}
                              />
                            </label>
                          );
                        })}
                      </motion.div>
                    )}
                  />
                )}

                <button
                  type={step === 4 ? "submit" : "button"}
                  onClick={nextStepHandler}
                  disabled={isSubmitting}
                  className={`bg-mainColor ${
                    isSubmitting && "cursor-not-allowed bg-hoverBg"
                  } w-full block text-white py-2 rounded-lg text-base `}
                >
                  {getButtonText()}
                </button>
              </form>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default SkynetSurveyForm;
