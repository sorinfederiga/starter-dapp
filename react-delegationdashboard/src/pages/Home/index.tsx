import React from 'react';
import { Redirect } from 'react-router-dom';
import { faBan, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as Logo } from 'assets/images/logo.svg';
import State from 'components/State';
import { useContext } from 'context';
import WalletLogin from './Login/Wallet';
import WalletConnectLogin from './Login/WalletConnect';
import StatCard from 'components/StatCard';
import denominate from 'components/Denominate/formatters';
import { decimals, denomination } from 'config';

const Home = () => {
  const { totalActiveStake,contractOverview,aprPercentage,numberOfActiveNodes,numUsers,loading, error, loggedIn, egldLabel } = useContext();
  const ref = React.useRef(null);
  const getPercentage = (amountOutOfTotal: string, total: string) => {
    let percentage =
      (parseInt(amountOutOfTotal.replace(/,/g, '')) / parseInt(total.replace(/,/g, ''))) * 100;
    if (percentage < 1) {
      return '<1';
    }
    return percentage ? percentage.toFixed(2) : '...';
  };
  return (
    <div ref={ref} className="home d-flex flex-fill align-items-center">
      {error ? (
        <State
          icon={faBan}
          iconClass="text-primary"
          title="Something went wrong"
          description="If the problem persists please contact support."
        />
      ) : loggedIn ? (
        <Redirect to="/dashboard" />
      ) : loading ? (
        <State icon={faCircleNotch} iconClass="fa-spin text-primary" />
      ) : (
        <div className="cards d-flex flex-wrap">
        <StatCard title="Number of Users" value={numUsers.toString()} color="orange" svg="user.svg" />
        <StatCard title="Number of Nodes" value={numberOfActiveNodes} valueUnit="" color="purple" svg="nodes.svg"/>
        <StatCard title="Computed APR" value={aprPercentage} valueUnit="" color="orange" svg="leaf-solid.svg" percentage="Annual percentage rate incl. service fee" tooltipText="This is an approximate APR calculation for this year based on the current epoch" />
        <StatCard title="Service Fee" value={contractOverview.serviceFee || ''} valueUnit="%" color="red"  svg="service.svg"/>
        <StatCard title="Delegation Cap" 
            value={denominate({decimals, denomination, input: contractOverview.maxDelegationCap, }) || ''}
            valueUnit={egldLabel}
            color="green"
            svg="delegation.svg"
            percentage={`${getPercentage(denominate({ input: totalActiveStake, denomination, decimals, }), denominate({ decimals, denomination, input: contractOverview.maxDelegationCap, }))}% filled`}>
        </StatCard>        
        <div className="m-auto login-container">
          <div className="card my-spacer text-center">
            <div className="card-body p-spacer mx-lg-spacer">
              <Logo className="logo mb-spacer" />
              <h4 className="mb-spacer">Elrond Delegation Manager</h4>
              <br/>
              <div>
                <a
                  href={'https://t.me/twinsoft_ro'}
                  className="btn btn-primary px-sm-spacer mx-1 mx-sm-3"
                >
                  Telegram channel
                </a>
              </div>
              <br/>
              <p className="mb-spacer">Please select your login method:</p>
              <div>
                <a
                  href={process.env.PUBLIC_URL + '/ledger'}
                  className="btn btn-primary px-sm-spacer mx-1 mx-sm-3"
                >
                  Ledger
                </a>
                <WalletLogin />
                <WalletConnectLogin />
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>    
  );
};

export default Home;
