import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import PersonIcon from '@mui/icons-material/Person';
import GitHubIcon from '@mui/icons-material/GitHub';
import {  Email, GroupAddTwoTone, Groups2, House, InsertInvitation, LinkedIn, LocalActivity, Logout, Phone,  WhatsApp, Work } from '@mui/icons-material';

import WhatsAppContact from './Social/WhatsAppContact';
import GitHubContact from './Social/GitHubContact';
import EmailContact from './Social/EmailContact';
import LinkedInContact from './Social/LinkedInContact';
import Contact from './Contact';
import { useCookies } from 'react-cookie';
import Login from './Login';
import SignUp from './SignUp';
import FriendsChat from './FriendsChat';
import Invitations from './Invitations';
import GroupInvitations from './GroupInvitations';
import MyGroups from './MyGroups';
import Home from './Home';
import { Badge } from '@mui/material';
import GetInvitations from './GetInvitations';





const NAVIGATION = [
  {
    kind: 'header',
    title: 'Home',
  },
  {
    segment: '',
    title: 'Home',
    icon: <House />,
  },
  {
    kind: 'header',
    title: 'Personal Chats',
  },
  {
    segment: 'myfriends',
    title: 'My Friends',
    icon: <PersonIcon />,
  },
  {
    segment:'invitations',
    title:'Invitations',
    icon:<Badge badgeContent={<GetInvitations/>} color='error'>
      <InsertInvitation/>
    </Badge>
  },
  {
    kind: 'divider',
  },
  {
    kind:'header',
    title:'Group Chats'
  },
  {
    segment: 'mygroups',
    title: 'My Groups',
    icon: <Groups2 />,
  },
  {
    segment:'groupinvitations',
    title:'Group Invitations',
    icon:<GroupAddTwoTone />
  },

  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Developer Contact',
  },
  {
    segment: 'contacts',
    title: 'Contacts',
    icon: <Phone />,
    children: [
      {
        segment: 'github',
        title: 'Github',
        icon: <GitHubIcon />,
      },
      {
        segment: 'linkedin',
        title: 'LinkedIn',
        icon: <LinkedIn />,
      },
      {
        segment: 'whatsapp',
        title: 'WhatsApp',
        icon: <WhatsApp />,
      },
      {
        segment: 'email',
        title: 'Gmail',
        icon: <Email />,
      },
    ]
  },
  {
    kind:'divider'
  },
  {
    segment:'logout',
    title:'Logout',
    icon:<Logout/>
  }
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
    
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));




export default function DashBoard(props) {
  const { window } = props;
  const [cookies,setCookies,removeCookies]=useCookies(['user']);
  const router = useDemoRouter('/');
  const renderContent = () => {
    switch (router.pathname) {
        case '/':
            return <Home/>
        case '/logout':
          router.pathname='/'
            removeCookies('user');
            break;
        case '/myfriends':
            return<FriendsChat navigate={router.navigate}/>
        case '/contacts':
          router.pathname='/contacts';
            return <Contact navigate={router.navigate}/>
        case '/contacts/whatsapp':
          router.pathname='/contatcs/mypath'
        return <WhatsAppContact navigate={router.navigate} />;  
      case '/contacts/github':
        router.pathname='/contacts/github';
        return <GitHubContact navigate={router.navigate} />;
      case '/contacts/email':
        router.pathname="/contacts/email"
        return <EmailContact navigate={router.navigate} />;
      case '/contacts/linkedin':
        router.pathname='/contacts/linkedin';
        return <LinkedInContact navigate={router.navigate} />;
        case '/invitations':
          router.pathname='/invitations'
            return<Invitations navigate={router.navigate} />
        case '/groupinvitations':
          router.pathname='/groupinvitations'
            return <GroupInvitations navigate={router.navigate}/>
            case '/mygroups':
              router.pathname='/mygroups'
                return <MyGroups navigate={router.navigate}/>
      default:
        router.pathname='/'
        return <div>404: Page Not Found</div>;
    }
  };

  React.useEffect(() => {
    //console.log('Current Path:', router.pathname);
  }, [router.pathname]);
  const[newUser,setNewUser]=React.useState(false);

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={window ? window() : undefined}
    >
      {cookies.user ?(<DashboardLayout sx={{width:'100%'}}>
        {renderContent()}
        
      </DashboardLayout>):(newUser ?<SignUp />:<Login setNewUser={setNewUser}/>)}
      
    </AppProvider>
  );
}
