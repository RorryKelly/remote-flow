import loadable from "@loadable/component"
import { IconBaseProps, IconType } from "react-icons/lib"
import { FaAdjust, FaBan, FaBatteryEmpty, FaBatteryFull, FaBatteryHalf,FaChartLine, FaChartPie, FaCheckDouble, FaCircle,FaCircleNotch,FaClipboardList,FaClone, FaCloudMoon, FaCloudSun, FaCloudRain, FaCog, FaHistory, FaRegLaugh, FaRegMeh, FaRegFrown, FaRegSadTear, FaRegClock, FaRegCircle, FaRegCheckCircle } from "react-icons/fa";



interface typesPropsIcon {
  nameIcon: string;
  propsIcon?: IconBaseProps
}

export function Icon(name: string): JSX.Element {
  const iconMap = new Map([
    ['FaAdjust', <FaAdjust size={'1.5rem'} key={'adjust'}/>],
    ['FaBan', <FaBan size={'1.5rem'} key={'FaBan'}/>],
    ['FaBatteryEmpty', <FaBatteryEmpty size={'1.5rem'} key={'FaBatteryEmpty'}/>],
    ['FaBatteryFull', <FaBatteryFull size={'1.5rem'} key={'batteryFull'}/>],
    ['FaBatteryHalf', <FaBatteryHalf size={'1.5rem'} key={'batteryHalf'}/>],
    ['FaChartLine', <FaChartLine size={'1.5rem'} key={'chartLine'}/>],
    ['FaChartPie', <FaChartPie size={'1.5rem'} key={'chartpie'}/>],
    ['FaCheckDouble', <FaCheckDouble size={'1.5rem'} key={'checkDouble'}/>],
    ['FaCircle', <FaCircle size={'1.5rem'} key={'circle'}/>],
    ['FaCircleNotch', <FaCircleNotch size={'1.5rem'} key={'circleNotch'}/>],
    ['FaClipboardList', <FaClipboardList size={'1.5rem'} key={'clipboardList'}/>],
    ['FaClone', <FaClone size={'1.5rem'} key={'clone'}/>],
    ['FaCloudMoon', <FaCloudMoon size={'1.5rem'} key={'cloudMoon'}/>],
    ['FaCloudSun', <FaCloudSun size={'1.5rem'} key={'cloudSun'}/>],
    ['FaCog', <FaCog size={'1.5rem'} key={'cog'}/>],
    ['FaCloudRain', <FaCloudRain size={'1.5rem'} key={'cloudRain'}/>],
    ['FaHistory', <FaHistory size={'1.5rem'} key={'history'}/>],
    ['FaRegLaugh', <FaRegLaugh size={'1.5rem'} key={'reglaugh'}/>],
    ['FaRegMeh', <FaRegMeh size={'1.5rem'} key={'regMeh'}/>],
    ['FaRegFrown', <FaRegFrown size={'1.5rem'} key={'regFrown'}/>],
    ['FaRegSadTear', <FaRegSadTear size={'1.5rem'} key={'regSadTear'}/>],
    ['FaRegClock', <FaRegClock size={'1.5rem'} key={'FaRegClock'}/>],
    ['FaRegCircle', <FaRegCircle size={'1.5rem'} key={'FaRegCircle'}/>],
    ['FaRegCheckCircle', <FaRegCheckCircle size={'1.5rem'} key={'FaRegCheckCircle'} />]
  ]);

  return iconMap.get(name) || <></>
}