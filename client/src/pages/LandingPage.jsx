import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import Header from "../components/Headers";
import Footer from "../components/Footer";
 
function DiffSpan({ data }) {
  return (
    <>
      <span className="text-[#D55586]">{data}</span>
    </>
  );
}

export default function LandingPage() {
  const section2CostingYorRevenue = [
    {
      logo: "/LandingPage/section2CostingYouRevenue/watsapp.png",
      title: "Missed WhatsApp Messages",
      para: "Stay connected and never miss important WhatsApp messages.",
      backColor: "#F0B83B",
    },
    {
      logo: "/LandingPage/section2CostingYouRevenue/slowFollow.png",
      title: "Slow follow-ups on Calls",
      para: "Delayed responses and missed callbacks can weaken client relationships",
      backColor: "#9CD59E",
    },
    {
      logo: "/LandingPage/section2CostingYouRevenue/inconsistent.png",
      title: "Inconsistent Agent Responses",
      para: "Inconsistent agent responses undermine reliability",
      backColor: "#ACD3EA",
    },
    {
      logo: "/LandingPage/section2CostingYouRevenue/visibility.png",
      title: "No visibility into Performance",
      para: "Driving measurable growth through strategic performance optimization.",
      backColor: "#F9BCF6",
    },
    {
      logo: "/LandingPage/section2CostingYouRevenue/manualHandling.png",
      title: "Leads lost due to Manual Handling",
      para: "Inconsistent agent responses undermine reliability",
      backColor: "#E7A7A7",
    },
  ];

  const section4TotalControl = [
    {
      title: "AI-Driven Chat & Voice",
      img: "/LandingPage/section4TotalControl/one.png",
      points: [
        "Intelligent conversations powered by real-time AI across chat and voice.",
        "Seamless AI communication that understands, responds, and adapts instantly.",
        "Smart voice and chat experiences built for modern businesses.",
      ],
    },
    {
      title: "24/7 Automated Engagement",
      img: "/LandingPage/section4TotalControl/two.png",
      points: [
        "Turn every moment into an opportunity with intelligent, nonstop customer interaction.",
        "Capture, convert, and connect — even while you sleep.",
      ],
    },
    {
      title: "Inbound + Outbound Handling",
      img: "/LandingPage/section4TotalControl/three.png",
      points: [
        "Optimizing Every Touchpoint of Your Supply Chain",
        "Precision Handling from Arrival to Departure",
      ],
    },
    {
      title: "Prediction & Forcasting",
      img: "/LandingPage/section4TotalControl/four.png",
     points: [
      "Leverage AI-powered insights to predict customer behavior and demand.",
      "Make smarter decisions with real-time forecasting and data-driven analytics.",
      "Anticipate trends and optimize performance before challenges arise.",
    ],
    },
  ];

  const valueMatricsTop = [
    {
      title: "Higher Lead Conversion Rates",
      para: "Turn more visitors into qualified customers with a conversion-focused strategy. By combining optimized landing pages, clear calls-to-action, and data-driven user journeys, we remove friction from the buying process and guide prospects toward taking action.",
      img: "/LandingPage/section7ValueMatrics/higherLead.png",
    },
    {
      title: "70% Faster Response Time",
      para: "Experience lightning-fast performance with optimized processing and intelligent caching. Our system delivers results up to 70% quicker, reducing waiting time and improving overall productivity.",
      img: "/LandingPage/section7ValueMatrics/faster.jpg",
    },
    {
      title: "3× More Conversations  Handled",
      para: "A UI element (like in a website/app) that shows conversation details inside a text container or box?",
      img: "/LandingPage/section7ValueMatrics/more.jpg",
    },
  ];

  const trustSecurity = [
    {
      title: "Enterprise-grade security",
      para: "Enterprise-grade security is a comprehensive approach to safeguarding data, systems, and networks at an organizational level.",
      img: "/LandingPage/section8TrustSecurity/security.png",
    },
    {
      title: "WhatsApp-compatible architecture",
      para: "Enterprise-grade security is a comprehensive approach to safeguarding data, systems, and networks at an organizational level.",
      img: "/LandingPage/section8TrustSecurity/watsapp.png",
    },
    {
      title: "Scalable WebRTC infrastructure",
      para: "Enterprise-grade security is a comprehensive approach to safeguarding data, systems, and networks at an organizational level.",
      img: "/LandingPage/section8TrustSecurity/scalable.png",
    },
    {
      title: "Data privacy compliant",
      para: "We collect and process your personal information (such as name, email address, and contact details) solely for the purpose of providing our services and communicating with you.",
      img: "/LandingPage/section8TrustSecurity/privacy.png",
    },
  ];

  const [valueMatricsImgIndex, setValueMatricsImgIndex] = useState(0);
  const valueMatricsArrSize = valueMatricsTop.length;

  function changeValueMatricsImgIndexNext(step) {
    if (step == "next") {
      setValueMatricsImgIndex((valueMatricsImgIndex + 1) % valueMatricsArrSize);
    } else if (step == "prev") {
      if (valueMatricsImgIndex == 0) {
        setValueMatricsImgIndex(valueMatricsArrSize - 1);
      } else {
        setValueMatricsImgIndex(valueMatricsImgIndex - 1);
      }
    }
  }
  const [docAssServerUrl, setDocAssServerUrl] = useState("");


  useEffect(() => {
    fetch("/config")
    
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.text();
      })
      .then((text) => {
        try {
          const data = JSON.parse(text);
         if (data.DocAss_server_url) {
          localStorage.setItem("DocAss_server_url", data.DocAss_server_url);
          // console.log("✅ DocAss server URL stored:", data.DocAss_server_url);
        } 
          setDocAssServerUrl(data.DocAss_server_url || "");
          // console.log("Fetched DOC_API_URL from server:", data.DocAss_server_url);
        } catch (e) {
          console.error("Failed to parse JSON from /config:", text);
        }
      })
      .catch((err) => {
        console.error("Fetch error for /config:", err);
      });
  }, []);

  return (
    <>
     <Header />
      {/* Display the config value at the top for demo/testing */}
      {/* {docAssServerUrl && (
        <div style={{ background: '#e0f7fa', color: '#006064', padding: '8px', textAlign: 'center' }}>
          DOC_API_URL: {docAssServerUrl}
        </div>
      )} */}
      <section className=" min-h-screen w-screen flex flex-col sm:flex-row gap-10 justify-center items-center p-6 sm:p-24">
        <div className="absolute inset-0 bg-[url('/LandingPage/section1/bg.png')]  bg-cover bg-center opacity-40 h-full w-full z-[-10] " />

        <div className="flex flex-col gap-6 w-full sm:w-[50%] justify-center h-fit sm:h-full ">
          <h1 className="text-4xl font-bold sm:text-5xl leading-normal pt-30 sm:pt-0">
            AI That Converts <br />
            <DiffSpan data="Conversations" /> Into Revenue
          </h1>
          <p className=" capitalize">
            Voxa24 is an intelligent communication system that autonomously
            manages WhatsApp chats and web calls — capturing leads, qualifying
            prospects, and delivering real-time insights for faster growth.
            Primary CTA
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <Link
              to={""}
              className="bg-[#2276B6] text-white rounded-lg px-14 py-2 whitespace-nowrap"
            >
              Try it Free
            </Link>
            <Link
              to={""}
              className="border-[#2276B6] text-[#2276B6] rounded-lg px-14 py-2 border-2 whitespace-nowrap"
            >
              Book A Live Demo
            </Link>
          </div>
        </div>

        <img
          src="/LandingPage/section1/sideImage.png"
          className=" w-[650px]  rounded-2xl"
        />
      </section>

      <section className="flex flex-col gap-24 py-15 px-6 sm:p-20 bg-[#ffe6723f] items-center justify-center pt-12 pb-12">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Your <DiffSpan data="Conversations" /> Are Costing{" "}
          <DiffSpan data="You Revenue" />{" "}
        </h1>
        <div className="flex flex-col sm:flex-row gap-6 justify-center ">
          {section2CostingYorRevenue.map((ele, index) => {
            return (
                <div
                  key={ele.title}
                className="flex flex-col relative p-8 pt-[50px] rounded-lg w-full items-center gap-1 text-center mt-[50px]"
                style={{ backgroundColor: `${ele.backColor}67` }}
              >
                <div
                  className="p-2 border-2 top-0 border-white shadow-sm shadow-black/30 h-fit w-fit rounded-full absolute -translate-y-1/2"
                  style={{ backgroundColor: `${ele.backColor}` }}
                >
                  <img src={ele.logo} className="h-[60px] w-[60px]" />
                </div>
                <h2 className="font-medium text-sm">{ele.title}</h2>
                <p className="text-xs">{ele.para}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* <section className="flex justify-center flex-col sm:flex-row gap-10 py-15 px-6 sm:p-20 items-center w-screen bg-[#FFEBF3] pt-12 pb-12">
        <div className="w-full sm:w-[50%] flex justify-center items-center">
          <video
            src="/LandingPage/section3Video/section3Video.mp4"
            controls
            className="w-full sm:w-[600px] h-auto"
          />
        </div>

        <div className="w-full sm:w-[50%] sm:p-20">
          {" "}
          <h1 className=" font-bold text-2xl border-b-4 border-white pb-4 w-fit mb-4 ">
            Video
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
            tempora, velit quia temporibus officiis fugiat quo nesciunt mollitia
            earum, tempore, porro doloribus consectetur dolore quisquam? Ratione
            natus iusto harum unde.
          </p>
        </div>
      </section> */}

  <section className="flex justify-center flex-col sm:flex-row gap-10 py-15 px-6 sm:p-20 items-center w-screen bg-[#FFEBF3] pt-12 pb-12">
  <div className="w-full sm:w-[50%] flex justify-center items-center">
    <iframe
      src="https://www.youtube.com/embed/4LhyRydDXV4"
      title="Section Video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full sm:w-[600px] h-[340px]"
    />
  </div>

  <div className="w-full sm:w-[50%] sm:p-20">
    <h1 className="font-bold text-2xl border-b-4 border-white pb-4 w-fit mb-4">
      Video
    </h1>
    <p>
      Engage smarter on WhatsApp. Voxa24 automates client conversations, maintains records, and ensures nothing slips through the cracks.
    </p>
  </div>
</section>

      <section className="relative flex justify-center flex-col gap-24 py-15 px-6 sm:p-20 items-center w-screen pt-12 pb-12">
        <img
          className="absolute top-20 left-0 w-20 sm:w-45 z-[-10] h-auto"
          src="LandingPage/section4TotalControl/sideImage.png"
        />
        <img
          className="absolute bottom-20 rotate-z-180 opacity-50 right-0 w-20 sm:w-45 h-auto"
          src="LandingPage/section4TotalControl/sideImage.png"
        />

        <div className="flex flex-col items-center w-full sm:w-[60%]">
          <h1 className="text-2xl sm:text-5xl text-center font-semibold">
            One Intelligent System. Total Control Over Conversations.
          </h1>
          <div className="border-b-4 border-b-[#0664B7] w-[150px] mt-6 " />
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap w-full sm:w-[80vw] gap-12 justify-around">
          {section4TotalControl.map((ele) => {
            return (
              <div className="rounded-md overflow-hidden w-full sm:w-[40%] flex shadow-xl shadow-black flex-col sm:flex-row" key={ele.title}>
                <div className="w-full sm:w-[50%] relative">
                  <img src={ele.img} className="w-full h-full object-cover" />
                  <div
                    className="absolute top-0 right-0 h-full w-32 bg-white"
                    style={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%)" }}
                  ></div>{" "}
                </div>
                <div className="flex flex-col gap-6 w-full sm:w-[50%] p-6 bg-white">
                  <h3 className="text-2xl font-bold">{ele.title}</h3>
                  <ul className="flex flex-col gap-3 list-[circle] marker:text-yellow-400 marker:text-xl pl-5 text-xs">
                    {ele.points.map((p, idx) => {
                      return <li key={idx}>{p}</li>;
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative flex justify-center flex-col gap-24 py-15 px-6 sm:p-20 items-center w-screen bg-[#ffe6723f] pt-12 pb-12">
        <div className="flex flex-col items-center w-full sm:w-[60%]">
          <h1 className="text-2xl sm:text-5xl text-center font-semibold">
            Our Products{" "}
          </h1>
          <div className="border-b-4 border-b-[#0664B7] w-[150px] mt-6 " />
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap w-full sm:w-[80vw] gap-12 justify-around mt-20">
          <div className="relative -top-20 w-full sm:w-[40%] rounded-lg shadow-lg p-10 shadow-[#2A76B2] bg-[#74B3E5] flex flex-col gap-6">
            <h1 className="bg-white py-2 px-4 rounded-full w-full text-center font-bold text-2xl">
              Voxa24 Communication
            </h1>
            <img
              src="LandingPage/section5ProductSpilit/voxaC.png"
              className="w-full h-auto rounded-lg"
            />
            <ul className="flex flex-col gap-3 list-[circle] marker:text-xl pl-5 text-lg text-white ">
              <li>AI agents handle WhatsApp & web calls</li>
              <li>Qualify leads automatically</li>
              <li>Follow-ups without human dependency</li>
              <li>Consistent brand communication</li>
            </ul>
          </div>

          <div className="w-full sm:w-[40%] rounded-lg shadow-lg p-10 shadow-[#E9DF8E] bg-[#F9EF98] flex flex-col gap-6">
            <h1 className="bg-white py-2 px-4 rounded-full w-full text-center font-bold text-2xl">
              Voxa24 Communication + Analytics
            </h1>
            <img
              src="LandingPage/section5ProductSpilit/voxaCAnalytics.jpg"
              className="w-full h-auto rounded-lg"
            />
            <ul className="flex flex-col gap-3 list-[circle] marker:text-xl pl-5 text-lg text-white ">
              <li>Real-time dashboards</li>
              <li>Lead scoring & prioritization</li>
              <li>Conversion trend analysis</li>
              <li>Performance & response analytics</li>
            </ul>
          </div>
        </div>
      </section>

      <section className=" flex justify-center flex-col gap-24 py-15 px-6 sm:p-20 items-center w-screen bg-[#FFEBF3] pt-12 pb-12">
        <div className="flex flex-col items-center w-full sm:w-[60%]">
          <h1 className="text-2xl sm:text-5xl text-center font-semibold">
            How It Works
          </h1>
          <div className="border-b-4 border-b-[#0664B7] w-[150px] mt-6 " />
        </div>
        <img
          src="LandingPage/section6HowItWorks/howItWork.png"
          className="w-full h-auto object-cover rounded-2xl"
        />
      </section>

      <section className=" flex justify-center flex-col gap-24 py-15 px-6 sm:p-20 items-center w-screen pt-12 pb-12">
        {" "}
        <div className="flex flex-col items-center w-full sm:w-[60%]">
          <h1 className="text-2xl sm:text-5xl text-center font-semibold">
            Value Matrics
          </h1>
          <div className="border-b-4 border-b-[#0664B7] w-[150px] mt-6 " />
        </div>
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center ">
          <div className="flex w-full sm:w-fit justify-around">
            <button
              onClick={() => changeValueMatricsImgIndexNext("prev")}
              className="p-4 font-bold text-2xl bg-[#F65B97] text-white rounded-full h-fit"
            >
              <FaArrowRight className="rotate-180" />
            </button>

            {/** only for mobile */}
            <button
              onClick={() => changeValueMatricsImgIndexNext("next")}
              className="p-4 font-bold text-2xl bg-[#F65B97] text-white rounded-full h-fit sm:hidden"
            >
              <FaArrowRight />
            </button>
          </div>

          <div className="w-full sm:w-[27%] rounded-lg shadow-lg p-10 shadow-[#E9DF8E] bg-[#F9EF98] flex-col gap-6 bg-[#F17EAA5C]/70 hidden sm:flex">
            <img
              src={
                valueMatricsTop[
                  valueMatricsImgIndex == 0
                    ? valueMatricsArrSize - 1
                    : valueMatricsImgIndex - 1
                ].img
              }
              className="w-full h-auto rounded-lg"
            />
            <h1 className="font-bold text-lg text-[#A1003D]">
              {
                valueMatricsTop[
                  valueMatricsImgIndex == 0
                    ? valueMatricsArrSize - 1
                    : valueMatricsImgIndex - 1
                ].title
              }{" "}
            </h1>

            <p className="text-white text-sm">
              {
                valueMatricsTop[
                  valueMatricsImgIndex == 0
                    ? valueMatricsArrSize - 1
                    : valueMatricsImgIndex - 1
                ].para
              }
            </p>
          </div>

          <div className="w-full sm:w-[27%] rounded-lg shadow-lg p-10 shadow-[#E9DF8E] bg-[#F9EF98] flex flex-col gap-6 bg-[#F17EAA5C] sm:scale-110">
            <img
              src={valueMatricsTop[valueMatricsImgIndex].img}
              className="w-full h-auto rounded-lg"
            />
            <h1 className="font-bold text-lg text-[#A1003D]">
              {valueMatricsTop[valueMatricsImgIndex].title}{" "}
            </h1>

            <p className="text-white text-sm">
              {valueMatricsTop[valueMatricsImgIndex].para}
            </p>
          </div>

          <div className="w-full sm:w-[27%] rounded-lg shadow-lg p-10 shadow-[#E9DF8E] bg-[#F9EF98] hidden sm:flex flex-col gap-6 bg-[#F17EAA5C]/70">
            <img
              src={
                valueMatricsTop[
                  (valueMatricsImgIndex + 1) % valueMatricsArrSize
                ].img
              }
              className="w-full h-auto rounded-lg"
            />
            <h1 className="font-bold text-lg text-[#A1003D]">
              {
                valueMatricsTop[
                  (valueMatricsImgIndex + 1) % valueMatricsArrSize
                ].title
              }{" "}
            </h1>

            <p className="text-white text-sm">
              {
                valueMatricsTop[
                  (valueMatricsImgIndex + 1) % valueMatricsArrSize
                ].para
              }
            </p>
          </div>

          <button
            onClick={() => changeValueMatricsImgIndexNext("next")}
            className="p-4 font-bold text-2xl bg-[#F65B97] text-white rounded-full h-fit hidden sm:inline-block"
          >
            <FaArrowRight />
          </button>
        </div>
      </section>

      <div className="relative bg-white h-[200px] overflow-hidden">
        {" "}
        {/* Yellow Shape */}
        <div
          className="absolute top-0 left-0 w-full h-[200px] scale-125 bg-[#F1C01B]"
          style={{
            clipPath:
              "polygon(0% 70%, 40% 10%, 50% 65%, 190% -120%, 100% 95%, 0% 100%)",
          }}
        ></div>
      </div>

      <section className=" flex justify-center flex-col gap-24 py-15 px-6 sm:p-20 items-center w-screen bg-[#F1C01B] pt-12 pb-12">
        {" "}
        <div className="flex flex-col items-center w-full sm:w-[60%]">
          <h1 className="text-2xl sm:text-5xl text-center font-semibold text-white">
            Trust & Security
          </h1>
          <div className="border-b-4 border-b-white w-[150px] mt-6" />
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {trustSecurity.map((ele, index) => {
            return (
              <div
                key={index}
                className="relative flex flex-col relative p-8 rounded-lg w-full sm:w-[22%] gap-1 bg-white rounded-lg overflow-hidden"
              >
                <div className="bg-[#FDEDED] h-18 w-18 rounded-full absolute top-[-15px] left-[-15px] z-0 " />

                <img src={ele.img} className="h-[60px] w-[60px] mb-5 z-10" />

                <h2 className="font-medium text-sm border-b-2 border-black mb-2 z-10">
                  {ele.title}
                </h2>
                <p className="text-xs z-10">{ele.para}</p>
                <div className="bg-[#FDEDED] h-12 w-12 rounded-full absolute bottom-0 right-0 z-0 " />
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative flex justify-center flex-col gap-24 py-15 px-6 sm:p-20 items-center w-screen pt-12 pb-12">
        {" "}
        {/* Purple Polygon */}
        <div
          className="absolute top-0 left-0 w-full h-[40%] 
  bg-gradient-to-r from-pink-600 to-purple-700
  [clip-path:polygon(0%_0%,100%_0%,100%_15%,70%_65%,25%_70%,0%_100%)] z-[-10]"
        ></div>
        <div className="flex flex-col items-center w-full sm:w-[60%]">
          <h1 className="text-2xl sm:text-5xl text-center font-semibold text-white">
            Why Voxa24
          </h1>
          <div className="border-b-4 border-b-white w-[150px] mt-6" />
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-12 sm:gap-30  items-center">
          <img
            src="LandingPage/section9WhyVoxa/whyVoxa.jpg"
            className="w-full sm:w-[40%] h-auto rounded-lg shadow-2xl shadow-[#97C588]"
          />
          <ul className="flex flex-col gap-6 list-disc text-lg">
            <li>AI + Analytics in one system</li> <li>Chat + Voice unified</li>{" "}
            <li>Built for revenue, not vanity metrics</li>{" "}
            <li>Designed for leadership visibility</li>{" "}
            <li>Scales without scaling teams</li>
          </ul>
        </div>
      </section>

      <section className="flex justify-center py-15 px-6 sm:p-20 w-screen flex-col gap-8 items-center bg-[#FEFFD8] pb-12 pt-12">
        {/* <p className="text-center w-full sm:w-[70%] font-bold">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
          reprehenderit fugiat reiciendis officiis iusto sed quia minus ab amet
          voluptate? Minus totam exercitationem error nemo. Aspernatur modi
          accusamus omnis quo!
        </p> */}
        <div className="flex gap-6 justify-center">
          <Link
            to={""}
            className="bg-[#2FBEB7] rounded-sm py-2 px-6 text-white"
          >
            Start Free Trial
          </Link>
          <Link
            to={""}
            className="bg-gradient-to-b from-[#F57B6F] to-[#FEACA3] rounded-sm py-2 px-6 text-white"
          >
            Book A Live Demo
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
