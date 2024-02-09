# Server Health

A web app for monitoring web/database server health. Very tightly coupled to the
system configuration I use. Just outputs data in JSON format right now. Pretty
UI coming later.

## Installation

Clone the repository

```
git clone https://github.com/travishorn/server-health
```

Change into the repository directory

```
cd server-health
```

Install dependencies

```
npm install
```

Copy the environment variable example file

```
cp .env.local.example .env
```

Set your environment variables in `.env`

## Usage

Run the web app server

```
npm run dev
```

Navigate to http://localhost:5173/ in your browser

## To Do

- ETL logs
- Unattended upgrade logs
- Unattended upgrade details
- Unattended upgrade application details
- Unattended reboot logs
- Storage capacity
- RAM usage
- Top cpu usage
- Pretty UI

## License

The MIT License

Copyright 2024 Travis Horn

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
