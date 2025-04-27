import NavBar from "../../components/NavBar";

const Events = () => {
    return (
        <>
        <NavBar/>
        
      <div className="min-h-screen flex flex-col  justify-center item-center bg-[#1A1A1A] text-white p-6">
        <h1 className="text-2xl font-bold mb-2 text-center text-[#D4852D]">TROOP EVENTS </h1>
        <div className="calendar-container flex justify-center items-center" style={{ filter: 'invert(1) hue-rotate(180deg)' }}>
          <iframe 
            src="https://calendar.google.com/calendar/embed?height=750&wkst=1&ctz=Asia%2FKolkata&showPrint=0&showTitle=0&showTz=0&src=MTdiMGFiNWVkNmE5ZTlmMWUzOWQ5MWE5OGY4YWQ5ZmI5NmRmMzk3ZmQxYjA3MThiZDJjYWNmODE0MjYzOTcwY0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23F4511E" 
            // style={{ borderWidth: '0' }} 
            text-white
            width="2050px" 
            height="850px">
          </iframe>
        </div>
      </div>
      </>
    );
};

export default Events;

//   <iframe src="https://calendar.zoho.in/zc/ui/embed/#calendar=zz08021230a488858b0d6e5917f2d3b08b3eb59b3b2603b65fb33da265f6f7fc587d62de351d1ab30225c0e03419440cbeb7d5831d&title=Troop%20Events&type=1&language=en&timezone=Asia%2FKolkata&showTitle=1&showTimezone=1&view=day&showDetail=0&theme=7&eventColorType=light" title="Troop Events"width="350" height="500" frameBorder="0" scrolling="no"></iframe>

  {/* <div className="min-h-screen bg-[#1A1A1A] text-white p-6">
<h1 className="text-2xl font-bold mb-4 text-center">EVENTS FOR EACH MONTH</h1>
<div className="calendar-container" style={{ filter: 'invert(1) hue-rotate(180deg)' }}>
<iframe src="https://calendar.zoho.in/zc/ui/embed/#calendar=zz08021230a488858b0d6e5917f2d3b08b3eb59b3b2603b65fb33da265f6f7fc587d62de351d1ab30225c0e03419440cbeb7d5831d&title=&type=1&language=en&timezone=Asia%2FKolkata&showTitle=0&showTimezone=0&startingDayOfWeek=0&timeFormat=1&view=month&showDetail=0&theme=7&showAttendee=0&showSwitchingViews=1&eventColorType=bold&showAllEvents=0" 
title=""
width="1050px" 
 height="750px"
>

</iframe>
</div> */}