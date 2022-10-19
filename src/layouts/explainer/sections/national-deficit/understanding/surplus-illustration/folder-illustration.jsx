import * as styles from "./folder-illustration.module.scss";
import React from "react";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {withWindowSize} from "react-fns";

const FolderIllustration = ({width, tabList, color}) => {

  const tabListStyle = { borderColor: color };

  const tabStyle = {
    borderColor: 'white',//color,
    // boxShadow: `.25rem .25rem ${color}`,
    borderBottom: '0',
    // borderWidth: '0.125rem',
    margin: '0 0.5rem',
    // borderRadius: '5px 5px 0 0',
    padding: '0'
  };

  const tabStyleMobile = {
    // borderColor: color,
    // boxShadow: `.25rem .25rem ${color}`,
    // borderBottom: '0',
    // borderWidth: '2px',
    // borderRadius: '5px 5px 0 0',
    // margin: '0 0.25rem',
    // bottom: '-0.125rem',
    // padding: '0.375rem 0.75rem 0.188rem'
  };

  // const tabStyle = width < pxToNumber(breakpointLg) ? tabStyleMobile : tabStyleDesktop;

  const FolderTab = ({text}) => {
    return (
      <div id={styles.tabContainer}>
        <div className={styles.tabOutline}>
          <div className={styles.leftSide} />
          <div className={styles.tabItem}>
              <span className={styles.title}>{text}</span>
          </div>
          <div className={styles.rightSide} />
        </div>
      </div>
    )
  };

  return (
    <>
    <div className={styles.folderVisContainer} data-testid={'folder-illustration'}>
      <Tabs>
        <TabList style={tabListStyle} className={styles.tabList}>
          <Tab style={tabStyle}>
            <FolderTab text={tabList[0].title} />
          </Tab>
          <Tab style={tabStyle} >
            <FolderTab text={tabList[1].title} />
          </Tab>
          <Tab style={tabStyle}>
            <FolderTab text={tabList[2].title} />
          </Tab>
        </TabList>
        <TabPanel>
          <div className={styles.folderVis}>
            <div className={styles.folderContent}>
              {tabList[0].content}
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className={styles.folderVis}>
            <div className={styles.folderContent}>
              {tabList[1].content}
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className={styles.folderVis}>
            <div className={styles.folderContent}>
              {tabList[2].content}
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
      </>
  );
}

export default withWindowSize(FolderIllustration);
