import { Module, Room, LearningPath } from './types';

export const PATHS: LearningPath[] = [
  {
    id: 1,
    title: 'Junior Penetration Tester',
    description: 'Start your career in cybersecurity. Learn the core concepts of web vulnerabilities, network scanning, and privilege escalation.',
    icon: 'Shield',
    difficulty: 'Beginner',
    duration: '18 Hours',
    roomIds: [1, 2, 3]
  },
  {
    id: 2,
    title: 'Red Team Operator',
    description: 'Advanced offensive security path. Master Active Directory exploitation and advanced network pivoting.',
    icon: 'Zap',
    difficulty: 'Advanced',
    duration: '24 Hours',
    roomIds: [2, 4]
  },
  {
    id: 3,
    title: 'Web Security Specialist',
    description: 'Deep dive into web application security, bug bounty hunting, and advanced exploitation techniques.',
    icon: 'Globe',
    difficulty: 'Intermediate',
    duration: '12 Hours',
    roomIds: [1]
  }
];

export const ROOMS: Room[] = [
  {
    id: 1,
    title: 'Web Fundamentals',
    icon: 'Globe',
    description: 'Learn how the web works and how to exploit common web vulnerabilities.',
    difficulty: 'Easy',
    duration: '4 Hours',
    users: 14502,
    tags: ['Web', 'HTTP', 'Burp Suite', 'XSS'],
    tasks: [
      {
        id: 1,
        title: 'Introduction to Web',
        content: `
# How the Web Works
Before attacking web applications, you must understand how they function.

## HTTP Protocol
HTTP (Hypertext Transfer Protocol) is the foundation of data communication for the World Wide Web.
- **GET**: Retrieve data.
- **POST**: Submit data.
- **PUT**: Update data.
- **DELETE**: Remove data.

## Status Codes
- **200 OK**: The request succeeded.
- **301 Moved Permanently**: The resource has been moved.
- **403 Forbidden**: You don't have permission to access this.
- **404 Not Found**: The resource does not exist.
- **500 Internal Server Error**: The server encountered an error.
        `
      },
      {
        id: 2,
        title: 'Burp Suite Basics',
        content: `
# Burp Suite
Burp Suite is an integrated platform for performing security testing of web applications.

## The Proxy
The most crucial tool in Burp Suite is the intercepting proxy. It sits between your browser and the target application, allowing you to intercept, inspect, and modify traffic in both directions.

## Intruder
Intruder is a powerful tool for automating customized attacks against web applications. It is highly configurable and can be used to perform a huge range of tasks, from guessing directories to exploiting complex blind SQL injection vulnerabilities.
        `
      },
      {
        id: 3,
        title: 'Cross-Site Scripting (XSS)',
        content: `
# Cross-Site Scripting (XSS)
XSS vulnerabilities occur when an application includes untrusted data in a web page without proper validation or escaping.

## Types of XSS
1. **Reflected XSS**: The malicious script comes from the current HTTP request.
2. **Stored XSS**: The malicious script comes from the website's database.
3. **DOM-based XSS**: The vulnerability exists in client-side code rather than server-side code.

## Example Payload
\`<script>alert('XSS')</script>\`
        `
      }
    ]
  },
  {
    id: 2,
    title: 'Network Exploitation',
    icon: 'Network',
    description: 'Master network scanning, enumeration, and exploitation techniques.',
    difficulty: 'Medium',
    duration: '6 Hours',
    users: 8930,
    tags: ['Network', 'Nmap', 'Metasploit', 'Pivoting'],
    tasks: [
      {
        id: 1,
        title: 'Nmap Scanning',
        content: `
# Nmap Scanning
Nmap is the industry standard for network mapping and port scanning.

## Scan Types
- **TCP Connect Scan (-sT)**: Completes the 3-way handshake. Loud but reliable.
- **SYN Stealth Scan (-sS)**: Half-open scan. Faster and stealthier.
- **UDP Scan (-sU)**: Scans for UDP services. Slower but necessary for full coverage.

## Advanced Flags
- \`-A\`: Enables OS detection, version detection, script scanning, and traceroute.
- \`-p-\`: Scans all 65535 ports.
- \`-T4\`: Aggressive timing template for faster scans.
        `
      },
      {
        id: 2,
        title: 'Metasploit Framework',
        content: `
# Metasploit Framework
Metasploit is a powerful tool for developing and executing exploit code against a remote target machine.

## Basic Commands
- \`search [keyword]\`: Search for exploits, payloads, or auxiliary modules.
- \`use [module]\`: Select a module to use.
- \`show options\`: Display the options for the selected module.
- \`set [option] [value]\`: Set a value for an option.
- \`exploit\` or \`run\`: Execute the module.
        `
      }
    ]
  },
  {
    id: 3,
    title: 'Linux Privilege Escalation',
    icon: 'Terminal',
    description: 'Learn how to elevate your privileges from a standard user to root on Linux systems.',
    difficulty: 'Hard',
    duration: '8 Hours',
    users: 5210,
    tags: ['Linux', 'PrivEsc', 'SUID', 'Cron'],
    tasks: [
      {
        id: 1,
        title: 'Enumeration',
        content: `
# Linux Enumeration
The first step in privilege escalation is gathering information about the system.

## Key Commands
- \`uname -a\`: Print system information.
- \`id\`: Print user and group information.
- \`cat /etc/passwd\`: List all users on the system.
- \`sudo -l\`: List allowed (and forbidden) commands for the invoking user.
- \`find / -perm -u=s -type f 2>/dev/null\`: Find files with the SUID bit set.
        `
      },
      {
        id: 2,
        title: 'SUID Exploitation',
        content: `
# SUID Exploitation
SUID (Set owner User ID up on execution) is a special type of file permissions given to a file.

If a file with the SUID bit set is owned by root, executing that file will temporarily grant the user root privileges. If the executable has vulnerabilities or can be manipulated (e.g., GTFOBins), it can lead to a root shell.
        `
      }
    ]
  },
  {
    id: 4,
    title: 'Active Directory Basics',
    icon: 'Shield',
    description: 'Understand the core concepts of Windows Active Directory and common attack vectors.',
    difficulty: 'Medium',
    duration: '5 Hours',
    users: 11200,
    tags: ['Windows', 'AD', 'Kerberos', 'BloodHound'],
    tasks: [
      {
        id: 1,
        title: 'AD Architecture',
        content: `
# Active Directory Architecture
Active Directory (AD) is a directory service developed by Microsoft for Windows domain networks.

## Core Components
- **Domain Controller (DC)**: A server that responds to security authentication requests within a Windows domain.
- **Active Directory Domain Services (AD DS)**: The core functions of AD.
- **Kerberos**: The default authentication protocol for Windows domains.
        `
      },
      {
        id: 2,
        title: 'Kerberoasting',
        content: `
# Kerberoasting
Kerberoasting is a technique used to extract service account credential hashes from Active Directory.

Any authenticated domain user can request a Kerberos ticket for any service account. The ticket is encrypted with the service account's password hash. The attacker can then extract this ticket and attempt to crack the hash offline.
        `
      }
    ]
  }
];

export const MODULES: Module[] = []; // Keeping empty to avoid breaking old code if imported, but we will use ROOMS now.
