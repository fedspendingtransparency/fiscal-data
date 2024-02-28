import React, { FunctionComponent } from 'react';

const SavingsBondsAreFullyMatured: FunctionComponent = () => {
  return (
    <>
      <p>A savings bond can be redeemed any time after at least one year; however, the longer a bond is held
        (up to 30 years), the more it earns. When a savings bond is redeemed after five years, the owner receives
        the original value plus all accrued interest. If a bond is redeemed before five years, the holder loses the
        last three months of interest.
      </p>
      <p>
        Occasionally, bond owners hold onto bonds after they have reached maturity and are no longer earning interest.
        These outstanding but unredeemed bonds are called Matured Unredeemed Debt (MUD). The government continues to be
        responsible for this debt, as it may be redeemed at any time. Therefore, the Treasury has increased efforts to
        encourage bondholders to redeem their matured savings bonds. As of Month YYYY, there were XXX million
        matured unredeemed savings bonds held by investors.
      </p>
      <p>
        If bonds are held past their maturity date, the bonds can lose value due to inflation. To understand how this
        value is lost, see the illustration below.
      </p>
    </>
  )
}

export default SavingsBondsAreFullyMatured;
