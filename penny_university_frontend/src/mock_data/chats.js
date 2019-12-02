let chats = [
  {
    "title": "Re: (Request) [Specific] Entity Framework Core with .NET Core 1.1",
    "description": "",
    "date": "2017-01-14T17:25:59-08:00",
    "user": "bill.israel@gmail.com",
    "followups": [
      {
        "content": "If no one has any experience with C# and/or Entity Framework, do you know someone that might? This might be a blind spot or gap in the group we're attempting to assemble here and it'd be nice to have someone to reach out to that might be able to fill it. Thanks!\n",
        "date": "2017-01-14T17:25:59-08:00",
        "user": "bill.israel@gmail.com"
      },
      {
        "content": "I have a C# guru outside of Penny University that helped me with my issue.  I will recommend him to be a mentor.  \nThe solution had to do with preloading the data from the adjoined tables using the EF function .Include.  The function needed to be called before the filter to ensure the tables were loaded before the column was ever read. ",
        "date": "2017-01-17T10:37:11-08:00",
        "user": "devyncunningham@gmail.com"
      },
      {
        "content": "This issue is pretty common with .NET ORM frameworks, because a lot of them rely on the fact that LINQ in .NET (basically queries written in C# syntax in code instead of in SQL) are interpreted / executed on an as needed basis and deferred until the data they work with fully needed.\n\nWhen calling Queryable LINQ results from other code, any new LINQ statements being called are just tacked on to the deferred statements until there is some kind of final call to get the data (like Count(), Sum(), ToList(), etc.) When that call happens, if there is even one piece of code inside one of the LINQ statements that the SQL query parser can't figure out how to turn into SQL, the whole statement fails to parse. Here's a more concrete example:\n\nDateTime after = new DateTime(2016,1,1);\n\ndecimal total = DatabaseSession.Query<DataType>()\n    .Where(item => item.Created >= after)\n    .Where(item => item.Status == Status.Active)\n    .Where(item => item.Components.Sum(component => component.Price) < 1000) // Sum here may not parse happily as it would require a separate join in the DB\n    .Sum(item => item.Component.Sum(component => component.Price);\n...\n\ndecimal total = DatabaseSession.Query<DataType>()\n    .Where(item => item.Created >= after)\n    .Where(item => item.Status == Status.Active)\n    .ToList() // This forces the parsing and pulling of the data\n    .Where(item => item.Components.Sum(component => component.Price) < 1000) // Data already pulled, so no parsing to SQL needed now\n    .Sum(item => item.Component.Sum(component => component.Price);\n\nSome ORMs actually have a separate query building library that helps to hint at what you mean for certain situations like this to work around the shortcomings of the parser. They may also have an extensible framework in place to let you define exactly what something like a Sum inside a query should do.\n\nOn Tuesday, January 17, 2017 at 11:37:11 AM UTC-7, Devyn Cunningham wrote:\n\nThe solution had to do with preloading the data from the adjoined tables > using the EF function .Include.  The function needed to be called before > the filter to ensure the tables were loaded before the column was ever > read. >\n",
        "date": "2017-01-17T11:02:22-08:00",
        "user": "mikeschuld@gmail.com"
      },
      {
        "content": "I am currently working on a side project in C# using Entity Framework core and have run into a bit of a road block.  I was hoping someone could walk me through specific details of Computed Columns vs Not Mapped vs DatabaseGenerated.  I am attempting to use a server side computed column in a view model to sum all values of its navigational reference values.  Think [Account] And [Transactions] with [Account] having a navigational references to all transactions associated with it.  Then a calculated column that attempt to get the sum of all its transactions.  \n\n",
        "date": "Wed, 1 Dec 2017 12:34:56 -0700",
        "user": "devyncunningham@gmail.com"
      }
    ],
    "id": 1
  },
  {
    "title": "Let's Get Started!",
    "description": "",
    "date": "2017-01-15T14:51:04-06:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "Hello Penny University early adopters,\n\nAt the end of this month we will release Penny University to the masses. In\nthe next week I am asking you all to do Penny U a huge favor -- *get\nstarted! *Please *everyone* (including those signed up to teach):\n\n   - Find a topic that you're interested in learning.\n   - Email penny-university@googlegroups.com to ask if anyone can meet with\n   you. OR contact individuals on the teachers list directly\n   (https://docs.google.com/spreadsheets/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit#gid&5205128)\n   .\n   - Set up a chat session (coffee shop, Google hangout, etc.).\n   - *And learn together - as peers!*\n   - Finally post what you learned at penny-university@googlegroups.com and\n   share with your friends on social media.\n\nThat last step is important! Letting others hear your experience is how we\nremind people of the value in this network.\n\n*In our Future*\nPenny University has members in four cities -- look at the list\n(https://docs.google.com/spreadsheets/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit#gid&5205128).\nWe're already coast-to-coast! But shaping our culture is up to you.\n\n   - Often, people will meet a single time and the \"learner\" will come away\n   with a clearer understanding of the topic they were interested in.\n   - Sometimes meetings will turn into longer-term relationships where a\n   team learns together and where projects are built.\n\nBut in all cases, you, the \"teachers\", are in charge of your availability\nand your interactions. So what will *you* make of Penny University?\n\n*Rollout Plan*\nSoon we will roll out Penny U to the world:\n\n   - 1/25 - GirlGeekDinner\n   - 1/26 - PyNash\n   - 2/4 - PyTennessee\n   - 2/7 - Code for Nashville\n   - Where can *you* pitch Penny U?\n\nYou can help by telling your friends. Now's the time. Feel free to invite\n\"teachers\"\n(https://docs.google.com/forms/d/e/1FAIpQLSfzhGHFivL7xfxMJvdrXfiPy132nSIL8Lzaxsk3t0cjiSo-wg/viewform)\nand invite \"learners\"\n(https://groups.google.com/forum/#!forum/penny-university) who belong here.\n\n\n\n*Now go out and learn and teach!*\n\n\nJohn Berryman\n*Author of Relevant Search\n(https://www.amazon.com/Relevant-Search-applications-Solr-Elasticsearch/dp/161729277X)\n(Manning)*\n*@JnBrymn (http://bit.ly/YFO5Hs)*\n*LinkedIn* (http://linkd.in/YKGnc8)\n",
        "date": "2017-01-15T14:51:04-06:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Hey Folks!\n\nIt's been a week and based upon what I'm hearing and reading in the forum, people are enjoying their experience with Penny University. But we're getting ready to kick things into high gear as we invite the larger community. Please help us out:\n\n   - If you have had a good learning/sharing experience with Penny University, then please write about it in the forum and share it on social media. (All Penny U links are publicly viewable.)\n   - If you *haven't* had a Penny-Chat yet, then set one up! Contact the forum with something you'd like to learn or see if there's already somebody signed up to teach your topic of interest. (https://docs.google.com/spreadsheets/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit#gid&5205128)\n   - If you're signed up to teach (on the list above) but you no longer have time, then please let me know and I'll take your name off the list. It's no problem at all! We just want make sure that those signed up to teach are as available as they said they would be. Later, when you have more time, reach out and we'll sign you back up!\n   - Finally, invite \"teachers\" (https://docs.google.com/forms/d/e/1FAIpQLSfzhGHFivL7xfxMJvdrXfiPy132nSIL8Lzaxsk3t0cjiSo-wg/viewform)\n    and invite \"learners\" (https://groups.google.com/forum/#!forum/penny-university) who belong here with us.\n   Cheers!\n\n",
        "date": "2017-01-23T09:30:30-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Hey, guess what!?\n\nThanks to Devyn Cunningham buying up the www.pennyuniversity.org domain and Josh Stephens helping me last night to point it to the right place, we now have an easier way to invite people to our community and our cause. From now on, just send folks toward www.pennyuniversity.org and they'll see the Google Group landing page. I all goes well, then in a few months we'll outgrow Google Groups and www.pennyuniversity.org will point to a shiny new app that will make it easier to find interesting topics and connect with people for penny-chats.\n\nCheers,\nJohn\n\n",
        "date": "2017-01-27T06:42:33-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "These are Exciting times for Penny University! Last week we started pitching Penny University at local meetups (Girl Geek Dinner and PyNash); we are now openly inviting people on the NashDev Slack; and this weekend we will have a booth at PyTN.\n\nThis is an important point to think ahead about the culture that we are creating.\n\n   - Let's make Penny University as inclusive and diverse as possible. If you know someone who belongs in Penny U, reach out to them. Pull them in!\n   - Be available! If you signed up to teach for X hours a week during mornings, then make sure you are there when people have questions! If you're too busy (we all get busy), no problem. Tell me and I'll modify your availability.\n   - Be curious. There are so many interesting things to learn and so many interesting people to help you learn them. *Take time to learn!*\n   - Share the wealth! If you have a good experience, then let people know. Add a \"Penny Chat Review\" in the Google Group. Share the link out on social media and in NashDev. This way everyone will recognize the value of our community.\n\nAnd if you see me at PyTN this weekend, say hi!\n-John\n",
        "date": "2017-02-02T06:20:57-08:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 2
  },
  {
    "title": "Request: Improving code reading efficiency",
    "description": "",
    "date": "2017-01-16T12:52:57-06:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "When programming, I feel like I'm pretty good with architecting my own code\nand figuring out algorithms, but I'm not nearly as good at reading through\nan existing code base. I tend to get too distracted trying understanding\nthe small details and it takes me a long time to find the piece that I'm\nreally looking for to begin with.\n\nI would love to screen share with someone, hand you a piece of my code, and\nwatch you think out loud as you read it and try to understand it. Maybe we\ncan help each other get better.\n\nJohn Berryman\n*Author of Relevant Search\n(https://www.amazon.com/Relevant-Search-applications-Solr-Elasticsearch/dp/161729277X)\n(Manning)*\n*@JnBrymn (http://bit.ly/YFO5Hs)*\n*LinkedIn* (http://linkd.in/YKGnc8)\n",
        "date": "2017-01-16T12:52:57-06:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "",
        "date": "2017-01-17T08:04:22-08:00",
        "user": "jason.orendorff@gmail.com"
      },
      {
        "content": "I wouldn't mind participating in this if people are open to it. This is almost certainly an area where I lack a bit and just being able to have a discussion about it with other people would likely prove useful to me. So, is there room for a third in that Hangout?\n\n\n- Bill\n\n>",
        "date": "2017-01-17T08:07:15-08:00",
        "user": "bill.israel@gmail.com"
      },
      {
        "content": "Orendorff has spoken for Tuesdays, but I'm unfortunately out next Tuesday (most likely). Could we settle for next Monday morning instead? I'd vote for 9:00AM.\n\nLet's try connecting on this hangout (https://hangouts.google.com/hangouts/_/calendar/amZiZXJyeW1hbkBnbWFpbC5jb20.0a1dssn82ljevq7h2d7m7mp2r0?authuser=1) (or call me if it doesn't work). Everybody bring some code to much through in whatever language you're comfortable with. I have a 1 file piece of code, but I'm thinking maybe we should have something larger and multi-file b/c that introduces a different kind of code reading.\n\n",
        "date": "2017-01-17T20:31:58-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "I'd love to sit in on this too!\n\n",
        "date": "2017-01-19T07:26:47-08:00",
        "user": "beck@eventbrite.com"
      },
      {
        "content": "OK, let's do this Monday at 9AM. Anyone who wants to join the party is welcome.\n\nHere's a link to a Google Hangout. No one is in it right now--click it on Monday morning:\nhttps://hangouts.google.com/hangouts/_/calendar/amZiZXJyeW1hbkBnbWFpbC5jb20.0a1dssn82ljevq7h2d7m7mp2r0?authuser=1\n\nWe'll pick some code to look at ahead of time so we can get started right at 9.\n\n-j\n\n",
        "date": "2017-01-19T08:14:25-08:00",
        "user": "jason.orendorff@gmail.com"
      },
      {
        "content": "I can join at 9 but I have to pop off for 15 minutes for standup at 9:15. As long as that isn't distracting, I'm in\n\n",
        "date": "2017-01-20T06:53:31-08:00",
        "user": "courey.elliott@myemma.com"
      },
      {
        "content": "Paste this on the terminal so that you're prepped:\n\ncd ~\nmkdir code_reading\ncd code_reading\ngit clone git@github.com:pallets/flask.git\ngit clone git@github.com:django/django.git\ngit clone git@github.com:pypa/pip.git\ngit clone git@github.com:bewest/argparse.git\ngit clone git@github.com:andymccurdy/redis-py.git\n\nOthers?\n\n",
        "date": "2017-01-20T08:51:59-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Planning on joining in the hangout as well.\n\n",
        "date": "2017-01-22T15:48:53-08:00",
        "user": "shenfieldmax@gmail.com"
      },
      {
        "content": "I'm interested.",
        "date": "2017-01-23T05:16:28-08:00",
        "user": "ryan@noisepuzzle.com"
      },
      {
        "content": "*Here is a recording of our first Penny University Live (https://www.youtube.com/watch?v=Czy7bgDd7Hc) where we covered code reading efficiency.*\n\n*Outline:*\n\n   - Jason Orendorff took the role of guinea pig by reading through a random python library (argparse) as we watched.\n   - The first goal was to quickly absorb the contents of the argparse library and to understand code organization.\n   - The second goal was to identify the source of a bug in the code.\n   - We had a conversation about what we learned.\n   - We turned the tables and I became the next guinea pig reading through redis-py.\n\n*Learnings:*\nFor me - I realized that code reading is effectively a tree traversal - you have to mentally understand how the code tree is \"shaped\", and as you're reading code, you have to constantly reevaluate the most optimal path to take in order to learn what you need from the code.\n\nThe trick is in pruning the tree.\n\nI think there is an intuitive element in learning what code to dig into and what code to ignore or come back to later. Watching Jason, I got a better idea of how another developer approaches this problem, and we were able to ask about some of the intuition that backs his decisions. Another interesting thing was to learn about the tooling and dev environment that others work in.\n\nThis was fun! I plan to do it again soon.\n~John Berryman\n\n*PS - \"Penny University Live\" is very informal. Want to make your own? Just setup up a public Google Hangout, invite others, and broadcast it to YouTube. (https://support.google.com/youtube/answer/7083786) Then remember to share the link and tell us about what you learned.*\n\n\n",
        "date": "2017-01-23T08:53:25-08:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 3
  },
  {
    "title": "Math with jnbrymn",
    "description": "",
    "date": "2017-01-17T12:28:52-06:00",
    "user": "jason.orendorff@gmail.com",
    "followups": [
      {
        "content": "Hey everyone,\n\nSince we're supposed to post about how Penny U works out for us...\n\nI met with John for lunch earlier this month. We talked about math.\n\n*   I tried to show John this proof about why there's a rectangle\n    hidden in every simple closed curve:\n\n    https://www.youtube.com/watch?v=AmgkSdhK4K8\n\n    This is probably the coolest proof I know.\n\n*   John showed me a way of visualizing 4-dimensional objects.\n    I'm still thinking about this now.\n\nIt was cool. Would lunch again.\n\n-j\n",
        "date": "2017-01-17T12:28:52-06:00",
        "user": "jason.orendorff@gmail.com"
      },
      {
        "content": "Ah, but do you know the proof that there are infinitely many primes? OR do you know the proof that there are only five regular polyhedrons? These are my favorites.\n\nMy least favorite is the 4-color problem proof. It was proved by a machine, so no human really gains any intuition from it.\n\n",
        "date": "2017-01-17T20:21:27-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "I finally watched that video! Neat stuff. I now know why a Mobius strip is important outside of just being a cool weird shape. This is the first time I made that connection. :)\n\n",
        "date": "2017-01-27T20:52:53-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "",
        "date": "2017-01-30T03:31:08-08:00",
        "user": "jason.orendorff@gmail.com"
      }
    ],
    "id": 4
  },
  {
    "title": "Math with jnbrymn",
    "description": "",
    "date": "2017-01-17T13:00:20-06:00",
    "user": "jason.orendorff@gmail.com",
    "followups": [
      {
        "content": "Hey everyone,\n\nSince we're supposed to post about how Penny U works out for us...\n\nI met with John for lunch earlier this month. We talked about math.\n\n*   I tried to show John this proof about why there's a rectangle\n    hidden in every simple closed curve:\n\n    https://www.youtube.com/watch?v=AmgkSdhK4K8\n\n    This is probably the coolest proof I know.\n\n*   John showed me a way of visualizing 4-dimensional objects.\n    I'm still thinking about this now.\n\nIt was cool. Would lunch again.\n\n-j\n",
        "date": "2017-01-17T13:00:20-06:00",
        "user": "jason.orendorff@gmail.com"
      }
    ],
    "id": 5
  },
  {
    "title": "Deliberate Practice",
    "description": "",
    "date": "2017-01-23T14:28:31-08:00",
    "user": "upjohnc@gmail.com",
    "followups": [
      {
        "content": "Penny University\n\n\"long-time listener, first time caller\"\n\nCal Newport was the first to introduce me to the idea of deliberate practice (book (https://catalog.library.nashville.org/GroupedWork/4a0aebba-68c9-cff6-7b25-6e92c69253e3/Home?searchId\u0013883555&recordIndex=2&page=1&searchSource=local), blog (http://calnewport.com/blog/)).  I don't think he was first to coin the phrase.  I believe it came from Anders Ericsson (book (https://catalog.library.nashville.org/OverDrive/5b48e06d-2ee2-4ff4-b2b3-bd80e6d8380e/Home)).  I have been interested in it as I have seen from golf that focused practice brings improvement rather than just being present.  At its core, it is the intentional focus on improving the skills that matter in your field.  For Cal, it started with trying to understand the habits of his more successful students.  He has since created a program to help people source the skills that matter and devise a plan to work on those skills.\n\nI would like to post the questions here to see what the Penny University thinks.\n\n- What developers do you admire?\n- What abilities do they possess that make them different or better?\n\n- When you hire, what are you looking for?\n\n- What characteristics of junior (new) developers do you appreciate?\n\n- What do you think your employer pays for?\n",
        "date": "2017-01-23T14:28:31-08:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "I like these questions, and I think deliberate practice is important. Truthfully, I probably don't do enough of it...maybe this will get me to do more. Anyway, here are my answers to your questions:\n\n\n- What developers do you admire?\n>\n\nRich Hickey, Armin Ronacher, Alex Gaynor, DHH, Jason Myers, Jason Orendorff, and probably a dozen or so others whose names escape me at the moment.\n \n- What abilities do they possess that make them different or better?\n>\n\nIt's hard to say what specific abilities each one possesses, but I'd say that generally they all have a curious nature, a desire to dig into and understand a problem, and a demonstrated ability to think critically and communicate clearly about that problem. The importance of the critical thinking and communication cannot be overstated.\n\n \n> - When you hire, what are you looking for?\n>\n\nThat would heavily depend on what the position is and what the expected experience level of the candidate is, but something that I think is a constant is that I want someone who wants to know more and will fail quickly but not _too_ quickly (they'll try to figure something out on their own, but won't waste a day spinning their wheels before asking for help). I think if you have those two things, I think there are a number of other personality traits those things imply that make for someone I want to work with.\n\n\n- What characteristics of junior (new) developers do you appreciate?\n>\n\nSee above.\n\n \n> - What do you think your employer pays for?\n>\n\nPhew, this is a heavy question. I think they pay for the ability to solve a problem. The more you're paid (that is, the further up the Jr -> Mid -> Sr ladder you are) the more they're paying for efficiency and correctness. I'm a firm believer that people aren't paying specifically for your time, or your ability to be in a certain place for a certain amount of time.\n ",
        "date": "2017-01-24T09:34:49-08:00",
        "user": "bill.israel@gmail.com"
      },
      {
        "content": "Jason Myers was gracious enough to give me his time so I could pick his brain on his path to becoming a software engineer.\n\nJason's trek in coding started with walking through Python the Hard Way.  He typed each of the lessons, meaning not copy paste.  As he was doing the lessons he made the rule of not looking at source code of any packages.  ",
        "date": "2017-02-02T12:45:44-08:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "Follow on question:  when learning something new, how do you know when you should stop?  Or when do you know you've gone down a rabbit trail?\n\nChad\n\n",
        "date": "2017-02-06T11:19:54-08:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "3 steps... If I'm more than 3 hops away from what I set out to learn...\nI've gone too far or I need to adjust my learning focus.\n\n\n",
        "date": "2017-02-06T14:32:43-05:00",
        "user": "jason@mailthemyers.com"
      }
    ],
    "id": 6
  },
  {
    "title": "Hey all, what's good",
    "description": "",
    "date": "2017-01-25T16:41:16+00:00",
    "user": "nick@codefornashville.org",
    "followups": [
      {
        "content": "Thanks for the invite to join the group. Looking forward to publishing this\nto my members in Code for Nashville.\n\nI've got a burning desire to learn math fundamentals (looking at you\nOrendorff) as I've started experimenting with building 3-D scenes with\naframe.js and getting into VR. Also because my math fundamentals are\nlargely crap.\n",
        "date": "2017-01-25T16:41:16+00:00",
        "user": "nick@codefornashville.org"
      },
      {
        "content": "I'm also looking to improve my rusty math and probability knowledge :) \nWould love to be included in a call/meetup for this.\n\n",
        "date": "2017-01-26T07:32:47-08:00",
        "user": "beck@eventbrite.com"
      },
      {
        "content": "",
        "date": "2017-01-26T07:49:19-08:00",
        "user": "jason.orendorff@gmail.com"
      },
      {
        "content": "",
        "date": "2017-01-26T07:55:30-08:00",
        "user": "jason.orendorff@gmail.com"
      },
      {
        "content": "I would get in on a probability hangout Monday at 9am.  I started a thread on ML math, if anyone is interested.\n\n",
        "date": "2017-01-26T08:18:21-08:00",
        "user": "ryan@noisepuzzle.com"
      },
      {
        "content": "If it becomes a Hangout, then remember to post the link here so that others can pop in. Also remember, it's pretty trivial to record these things (https://support.google.com/youtube/answer/7083786). I want to be involved, but as I posted in the other math topic, I'm kinda out of Pennies for the next couple of weeks :-/\n\n",
        "date": "2017-01-27T07:36:34-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": " ",
        "date": "2017-01-27T08:53:47-08:00",
        "user": "jason.orendorff@gmail.com"
      }
    ],
    "id": 7
  },
  {
    "title": "Math, Math and more Math",
    "description": "",
    "date": "2017-01-26T08:15:25-08:00",
    "user": "ryan@noisepuzzle.com",
    "followups": [
      {
        "content": "Penny-U friends,\n\nSeveral people, (Nick and Beck) have both mentioned an interest in Math.  I am by no means a Math expert but, I would love to have someone to talk Math with.\n\nTo kick it off...\n\nRecently, I have been learning the math and intuition underlying \"Support Vector Machines,\" specifically how the \"Kernel Trick\" works.  If you understand it, I would love to gain some new perspective. If you don't understand it, but are interested, I would love the opportunity to explain it.\n\nIs anyone interested in getting coffee and talking this topic, or other Machine Learning Math?\n",
        "date": "2017-01-26T08:15:25-08:00",
        "user": "ryan@noisepuzzle.com"
      },
      {
        "content": "Im very interested in this! I'm currently digging into the fundamentals of probability and math to start understanding the principles behind machine learning models. \n",
        "date": "2017-01-27T07:19:26-08:00",
        "user": "beck@eventbrite.com"
      },
      {
        "content": "I'm very interested in working with you Ryan. Unfortunately I'm out of Pennies this week and next, and then I'm on travel the following week :-/. Keep me in mind for a raincheck for sure.\n\nAt one point I understood the Kernel trick, so a goal for our Penny-chat would be for you to re-teach me how the Kernel trick worked and then if I remember everything, maybe I can give you some of the intuition I used to have about the math behind it.\n\n",
        "date": "2017-01-27T07:32:41-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "",
        "date": "2017-01-27T08:55:11-08:00",
        "user": "jason.orendorff@gmail.com"
      },
      {
        "content": "I'd be interested in joining.  And I can do Tuesday morning.\n\n",
        "date": "2017-01-28T05:44:22-08:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "Hey Chad,\n\nSorry for the delayed reply.  A couple of us are meeting tomorrow morning (8:30am) at Frothy Monkey on 5th if your interested.\n\nRyan\n\n",
        "date": "2017-01-30T14:02:18-08:00",
        "user": "ryan@noisepuzzle.com"
      },
      {
        "content": "Just an end-cap on the week...\n\nJason and I met Tuesday morning and discussed ML Math for SVMs.  I uncovered much about my known-knowns, known-unknown, and unknown-unknowns (with the SVM classifier).  Explaining things to others is a great way to test your own understanding of a topic.  Thanks Jason!\n\nBeck and I met Thursday and she offered me a quick intro to SEO.  We talked about keeping up with Google's (constantly changing) models, and discussed some practical applications of ML, within SEO.  I walked through some of my methods for digesting intimidating equations in Statistics, Calculus, or ML.  We also talked a little about Bayes' Theorem.  Thanks for the conversation Beck!\n\nChad, if your still interesting in getting together, let me know.  I have a couple days next week.\n\n\n",
        "date": "2017-02-03T07:10:48-08:00",
        "user": "ryan@noisepuzzle.com"
      },
      {
        "content": "Learnt a lot from Ryan about how to approach mathematical statements and expressions. He also introduced me to some of the mathematical ideas behind support vector machines. Very fascinating penny chat! Hope to do it again soon! \n\n",
        "date": "2017-02-03T07:15:08-08:00",
        "user": "beck@eventbrite.com"
      }
    ],
    "id": 8
  },
  {
    "title": "Review: Jason Bynum discusses high-level software skills.",
    "description": "",
    "date": "2017-01-26T09:26:39-06:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "Had a Penny-chat with Jason Bynum from Emma a week ago. We talked about the\nhigher-level, more abstract skills required in software development.\nHighlights include:\n\n   - A book recommendation: The Nature of Software Development\n   (https://pragprog.com/book/rjnsd/the-nature-of-software-development) -\n   Jason says it's a relatively quick read, but it's got lots of good stuff in\n   it.\n   - Jason emphasized a focus upon continuous delivery of value. Roughly\n   quoting the above book: \"When you ask developers 'What can you accomplish\n   in two weeks <on a given project>?' and they say 'nothing'. Then say,\n   'Well, what can you accomplish in 1 week?' , and then 'What value can you\n   add in one day?'\" Interpreted the wrong way and this seems like an\n   overbearing manager. But I think the appropriate interpretation is to\n   always challenge yourself to make sure you're delivering value. If you have\n   two weeks to work on a project and you can get anything of value delivered,\n   then it's likely that the project is poorly defined. Find a way to arrange\n   the work so that you focus on building the thing that matters first. And if\n   you do this exercise and realize that this project doesn't matter - then\n   don't do it. Work on things that deliver constant value.\n   - Early in Jason's career, someone gave him advice on work-life balance\n   - don't try to do both at once. When you're home, be completely and totally\n   home. And when you're at work, be completely and totally at work. I've\n   noticed since then, that I'll sometimes be at home with my daughter trying\n   to catch up on a little office work. Meg gets distressed because she's not\n   the center of my attention and I get distressed because I can concentrate\n   on work enough to make any progress. -- So maybe Jason has a point here. I\n   think I'll try *not* doing two things at once and see if I actually get\n   more accomplished.\n\nIt was a good Penny-chat! Thanks Jason.\n\nJohn Berryman\n*Author of Relevant Search\n(https://www.amazon.com/Relevant-Search-applications-Solr-Elasticsearch/dp/161729277X)\n(Manning)*\n*@JnBrymn (http://bit.ly/YFO5Hs)*\n*LinkedIn* (http://linkd.in/YKGnc8)\n",
        "date": "2017-01-26T09:26:39-06:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "The book recommendation is a good one.  William Golden introduced it to us when he joined Smile Direct Club.  I really liked the focus on value and delivering that value.  The other point of that book is deliverable code that can be put into production.  This turns the question of when is it done into what do you want to add next to this working app.  \nSo I like that Jason made those ideals the focus of his answer.  I wish there was a follow on book on how to get execs to buy into the process.\n\n\n",
        "date": "2017-01-27T07:30:58-08:00",
        "user": "upjohnc@gmail.com"
      }
    ],
    "id": 9
  },
  {
    "title": "Experience Contributing to (Free or) Open Source Software",
    "description": "",
    "date": "2017-01-27T05:21:21-08:00",
    "user": "shenfieldmax@gmail.com",
    "followups": [
      {
        "content": "I had a chat w/ Jason Myers a few days ago, I wanted to learn more about how to be a better contributor to open source, and also the tradeoffs off investing a lot of time and energy into free or open source software.  Here are some notes from our discussion:\n\n---\n\n*What makes a good contribution?*\nA good contribution restates the problem or feature being implemented, and explains how each portion of the patch solves the problem or supports the feature. It should also consider documentation and tests, adding tests for new features or bugs. The easier it is for a maintainer to understand what and why you are doing things, the more likely they are to look at your pull request.\n\nBuild a relationship with the maintainers - if there is a Gitter, Slack, or IRC channel introduce yourself. It will let them track you down when they need to ask a question, and make merging your pull requests easier. Every project is its own world.\n\nIf you are starting an open source project, use Github’s ISSUE_TEMPLATE.md and PULL_REQUEST_TEMPLATE.md to give people a template for new bugs and pull requests.\n\n*What makes an effective contributor?*\nDon’t play the commit game.  A single well formed bug fix or feature based on understanding the code thoroughly is better than many poorly formed commits to many projects.  When someone chooses to merge your code, they are taking ownership of it and saying they’re willing to support it in their free time.\n\nStart small. In the long term, a small bug fix might not add value to the project because it takes more effort to understand what you did and review than it would for the contributor, who know the code well, to write the fix.  But it builds trust with the maintainers, and you’re understanding of the project to implement larger changes.  You’ll add more value as a consistent contributor to a single project than as a sporadic contributor to many different projects.\n\n\n*What are the tradeoffs involved in open source?*\nIt is a time commitment, many if not most open source projects are run in people’s spare time as a hobby. Some people get jobs, write book’s, and speak because they contribute to an open source project. Some are paid to write open source software full time, or given blocks of money to implement specific features, or request donations, but the money coming in is not going to compare with what you could make consulting or as a contractor.\n\n*What motivates people to do open source?*\nTwo examples:\n\n   - An extra challenge when you are doing the same thing at work.\n   - The validation of having someone you respect approve your code, and the opportunity to learn from them when you don’t.\n\n---\n\nThanks Jason for taking the time to talk, your experience is insightful!\n",
        "date": "2017-01-27T05:21:21-08:00",
        "user": "shenfieldmax@gmail.com"
      }
    ],
    "id": 10
  },
  {
    "title": "Review: John Berryman discusses creating an appealing conference proposal",
    "description": "",
    "date": "2017-01-27T07:29:38-08:00",
    "user": "beck@eventbrite.com",
    "followups": [
      {
        "content": "Had a penny-chat with John Berryman to help me create  a proposal for the accelerated mobile pages conference. He helped me write an outline, create a well-formed summary and a bio that suited that conference.\n\nSome great points he made:\n- Create an in-depth outline of your talk before creating your summary\n- Think about your audience and what they would want out of your presentation when creating the outline and summary\n- the summary should be a guide to the outline of the presentation and give the audience a reason they should attend.\n\nThanks John! You're the best!\n",
        "date": "2017-01-27T07:29:38-08:00",
        "user": "beck@eventbrite.com"
      }
    ],
    "id": 11
  },
  {
    "title": "Tests in Django",
    "description": "",
    "date": "2017-01-28T14:28:07-08:00",
    "user": "upjohnc@gmail.com",
    "followups": [
      {
        "content": "I would like someone to help me with testing in Python.  Actually, I think it'd be better to ask about testing in Django as that might be a more narrow topic.  I am coming from the data side and the only testing I have done was to test that a page would load correctly which basically was a bunch of links to download csv's.  So actually applying the principles around unit testing, using asserts, and tdd, etc. are just concepts right now for me.  I hope that I have improperly used some terms to express my lack of knowledge.\n\nI don't have a code base to work off of right now.  So one thought is that a kind soul has a bit of code that they can walk me through.  A second thought is to ask to be pointed to a resource to get me started.\n\nTo note, it looks like I will be doing a project around importing and exporting data to users of an app.\n",
        "date": "2017-01-28T14:28:07-08:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "Hey Chad, I know we've seen each other a few times at PyNash, possibly even spoken to each other(!) but never officially met. I'm Anthony, Hi! While I'm far from anything that resembles an expert, or even someone proficient in TDD principles, I'd love to grab my TDD book and join you for lunch or two sometime soon. I highly recommend this book as an entry point for you since it's literally named Test Driven Development and all examples are based around a django app. We could spend a few lunches together, pull down his example codebase from git and skim through the book. A little about myself, I'm a python dev for Stratasan. So I deal very heavily with django and it's tdd practices daily there. Like I said, I'm definitely no expert, but if I'm unable to answer all of your questions, we can google them together and maybe I can at least get you started in the right direction.  (and I could get some data analysis knowledge too!)\n\n",
        "date": "2017-01-29T14:59:39-08:00",
        "user": "anthonyfox1988@gmail.com"
      },
      {
        "content": "I'd be interested in learning more about testing in Django as well. I have an okay understanding of mock and making assertions, but not general knowledge of good architecture or how to tackle more difficult testing scenarios.\n\n",
        "date": "2017-01-29T19:23:45-08:00",
        "user": "shenfieldmax@gmail.com"
      },
      {
        "content": "Max and Anthony,\n\nsorry for the delay.  Anthony, I will take you up on that offer and see what we can learn from the TDD book.  How does lunch tomorrow or Monday work for you two?\n\nChad\n\n",
        "date": "2017-02-02T08:02:51-08:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "Max, Anthony, and I are meeting up on Monday at 11 at Cinco de Mayo in Cummins Station.  I mention it if someone else wants to join.\n\n",
        "date": "2017-02-02T08:18:44-08:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "I could likely head up this discussion. Chad, do you have a fairly-well defined project to which you'd like to add tests (whether you're written any code or not)?\n\nScott\n\n",
        "date": "2017-02-02T08:29:53-08:00",
        "user": "scott.s.burns@gmail.com"
      },
      {
        "content": "Scott,\n\nWe don't have a specific project.  The plan, as it is, is to open up TDD and seeing what we can learn from each other.\n\nMy hope is to change my approach to code so that others can add to it.  I am coming at it from more of a data engineers perspective.  So, in time, I will probably have to find others who deal with data pipelines in order to add to the new knowledge gained from these conversations.\n\n",
        "date": "2017-02-02T08:53:21-08:00",
        "user": "upjohnc@gmail.com"
      }
    ],
    "id": 12
  },
  {
    "title": "Jorendorf in bunny suit",
    "description": "",
    "date": "2017-01-30T08:16:34-08:00",
    "user": "justinmcnm@gmail.com",
    "followups": [
      {
        "content": "The probability using baye's theorem and the number given was 10%\nIs that high? Does own the suit? Did his aunt make it if for him like in the movie the Christmas story?\n\nhttp://more-sky.com/data/out/4/IMG_40463.png\n\nhttps://wikimedia.org/api/rest_v1/media/math/render/svg/b1078eae6dea894bd826f0b598ff41130ee09c19\n",
        "date": "2017-01-30T08:16:34-08:00",
        "user": "justinmcnm@gmail.com"
      },
      {
        "content": "Ha ha ha! Yep. Good discussion this morning with Justin and Jason Orendorff. We covered Bayes theorem and as the example problem we posed the question \"What is the probability that Jason will be wearing a bunny suit given that it's the weekend?\" Unfortunately we had trouble recording, but it was a good discussion!\n\nFor me, I try to tie probability back to a visual representation so that I can gain some intuition. To that end, this blog post on Information Theory (https://colah.github.io/posts/2015-09-Visual-Information/), is one of the best that I've ever seen. The intuition regarding probability comes from the first couple of sections. (But the rest of the post about Information Theory is really spectacular as well.)\n\n-Cheers,\nJohn\n\n",
        "date": "2017-01-30T08:23:33-08:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 13
  },
  {
    "title": "Django Code Review",
    "description": "",
    "date": "2017-02-02T12:25:24-08:00",
    "user": "bwilburnstrength@gmail.com",
    "followups": [
      {
        "content": "I will be starting a Django side project intended to be used by NSS. I'd like to get someone to review and critique my code and give me feedback on how to make my code more DRY and clean, via PR's and in person meetings. ",
        "date": "2017-02-02T12:25:24-08:00",
        "user": "bwilburnstrength@gmail.com"
      },
      {
        "content": "Do you mind telling us a little more about your project? Do you have a public git repo?\n\n",
        "date": "2017-02-02T20:44:54-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "I could take a stab at reviewing it if you want :)\n\n",
        "date": "2017-02-03T07:16:10-08:00",
        "user": "beck@eventbrite.com"
      },
      {
        "content": "Ditto - I love reviewing code.\n\n",
        "date": "2017-02-06T05:09:50-08:00",
        "user": "shenfieldmax@gmail.com"
      },
      {
        "content": "I would love to hear any feedback from you guys, the more the merrier! I will let you know when I get it started up. \n",
        "date": "2017-02-06T14:29:18-08:00",
        "user": "bwilburnstrength@gmail.com"
      },
      {
        "content": "I can't necessarily give you advice on the things you're looking for but I am starting a new project in Django and would love to see your approach! \n",
        "date": "2017-06-28T19:16:45-07:00",
        "user": "delaine.wendling@gmail.com"
      },
      {
        "content": "I'm also curious. I've only started two (toy) Django projects. Both times I used one of the django cookiecutter templates recommended in Two Scoops of Django.\n\n",
        "date": "2017-07-06T12:35:19-07:00",
        "user": "shenfieldmax@gmail.com"
      },
      {
        "content": "We ended up meeting w/ Scott Burns and discussing\n\n   - How to start a Django project\n   - How Django fits into a world dominated by single page app frameworks\n   How to start a Django project: Scot recommended Cookiecutter Django (https://github.com/pydanny/cookiecutter-django), a community maintained project that lets you optionally configures favorites like White Noise, Celery, and Sentry.\n\nDjango and SPAs: Django was meant to have dominion over the entire generation of a web page. But over the past few years frameworks like React/Ember have overthrown HTML for JavaScript, with a popular optimization to pre \"render\" a React app (https://medium.com/@benlu/ssr-with-create-react-app-v2-1b8b520681d9) in a Node process. This article (https://hackernoon.com/reconciling-djangos-mvc-templates-with-react-components-3aa986cf510a) describes the tension well, as well as a gamut of approaches.  Scott favors relegating Django to implement APIs and business logic with Django Rest Framework (http://www.django-rest-framework.org/).  This approach is flexible enough to support client side rendering by serving static JS files, and eventually run Node processes to serve the frontend.  Eventbrite uses a tool similar to AirBnB's Hypernova (https://github.com/airbnb/hypernova) to embed \"rendered\" React apps into Django templates, running Node as a separate service that just executes and caches React code.\n\n*Odds and ends: *Scott recommends keeping business logic out of views, preferring to implement it in modules and models and leave views for input validation and authorization.\n\n",
        "date": "2017-07-15T13:00:11-07:00",
        "user": "shenfieldmax@gmail.com"
      },
      {
        "content": "My biggest questions dealt with the current shift in web development toward api-driven, single-page Javascript apps and how Django deals with this. The two biggest takeaways for me from Scott were Django Rest Framework, and pattern where Django pre-renders HTML using a Node server.\n\n\n*Django Rest Framework*\nDjango's answer to api-driven, single page apps is Django Rest Framework (http://www.django-rest-framework.org/). According to Scott, DRF treats RESTful APIs similar to the way that vanilla Django treats HTML forms. Basically DRF provides a declaritive way for you to describe your data through Serializers and Deserializers and then you automagically get the full functionality of well-formed RESTful endpoints. DRF knows about various data types (JSON, XML, etc.), and DRF implements CRUD functionality associated with the HTTP verbs (GET, POST, PUT, DELETE, etc.). Finally, every aspect of DRF's REST model is pluggable. So if you don't like some aspect of what it's doing, you can surely find a function to patch that behavior.\n\n\n*Django Pre-Rendering HTL through a Node Server*\nI actually heard about this just one week back (apparently we do this at Eventbrite... who knew!?). The problem is this:\n\n- Yes, the world is moving toward api-driven, single-page Javascript apps\n- *But*, when a browser receives a web page it's still nice to have HTML pre-rendered because\n  A) You're customers don't like staring at a blank screen while their browser downloads your 20MB javascript application.\n  B) Google web crawlers won't pay much attention to your pages if they have to actually run a headless browser to figure out what humans see on your web page\n- *However*, it's *not* nice to have to maintain both Django code and Javascript code that generates the same HTML (and additionally make sure it stays consistent!)\n\nSo here's what we've apparently decided to do... (And keep in mind here, I'm about as back-end as you can get... so I may be showing *my* backend here.) We decided to divide the task into the data collection chunk (Python) and the rendering chunk (Javascript). This way rather than having two code bases that are responsibly for rendering the same HTML response, we only have the Javascript side. But we *still* need to send HTML back to the browser for each request. So once Django has gathered the data required to render the page, we actually outsource the rendering to a Node server on the same machine. Node renders the HTML, ships it back to the Django app, and then Django sends it on to the browser. The browser then pulls in the HTML, CSS, scripts, etc., wakes up and continues it's life as an api-driven, single-page Javascript app. If it needs more data, it calls out to Django APIs (DRF perhaps?) and pull in what it needs.\n\nThe weird thing that remains though (and Max Shenfield helped my fully understand this) is that we still effectively render the HTML page twice - once on the Node server, and once again after the page wakes up in the browser and React or whatever starts retrieving the same data from APIs to fill in the HTML _again_. However, according to Max, improvements are already arriving wherein this second reload step is avoided when it is unnecessary.\n\n\nThanks Max and Delaine for showing up! And thanks Scott for teaching me a couple of big, new ideas.\n",
        "date": "2017-07-15T13:18:26-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 14
  },
  {
    "title": "What I would like to learn",
    "description": "",
    "date": "2017-02-04T12:14:43-06:00",
    "user": "daniel.j.aquino@gmail.com",
    "followups": [
      {
        "content": "Hi! I think PennyU is a great idea.  Anyway here are a few things I hope to learn/improve on from PennyU.\n\n-  Software Design\n- Refactoring.  I think it could be nice to have a small refactoring project, have members interested in it come up with their on solutions before hand and then walking through the teacher's solution/thought process (or even walk through everyone's solution given enough time).\n-  Understanding of different NoSQL systems.  Knowing the trade-offs between each different system and how it affects development.  Learning why a certain system would be selected over others (and over an RDBMS)\n-  Microservice Architecture.\n-  Efficient data structures/algorithms used in production.  (i.e. bloom filters, A* search).  It's been awhile since college and I haven't needed to use many advanced data structures.  Curious if any other places around here use them and learning more about them.\n-  Machine learning\n\n\n",
        "date": "2017-02-04T12:14:43-06:00",
        "user": "daniel.j.aquino@gmail.com"
      },
      {
        "content": "Regarding understanding the difference between NoSQL systems, consider attending my talk today at 3:00 (https://www.pytennessee.org/schedule/presentation/139/). I'll be talking about Elasticsearch and how it compares with MySQL.\n\nRegarding the rest of your requests, take a look at our directory (https://docs.google.com/spreadsheets/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit#gid&5205128). There are plenty of people who would be delighted to help you (including me!); contact them directly and set up a PennyChat!\n\n-John\n\n",
        "date": "2017-02-05T06:56:36-08:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 15
  },
  {
    "title": "Looking to Learn Front End Data Visualization",
    "description": "",
    "date": "2017-02-05T10:47:14-08:00",
    "user": "almostsurelyape@gmail.com",
    "followups": [
      {
        "content": "Hey all,\n\nI'm a Python Data Analyst, and mostly work with stuff on my own computer, however, I'm being tasked by work to start moving visualizations onto a website. I'm learning JavaScript, but I'm specifically interested in some Front End Data Visualization stuff, especially the interactive side, stuff like D3 and Crossfilter. I'd love to talk with someone about what possible with this and the best way to get started.\n",
        "date": "2017-02-05T10:47:14-08:00",
        "user": "almostsurelyape@gmail.com"
      },
      {
        "content": "There is bokeh that is a python api that creates the D3 visualization.  Datacamp has a good lesson track on it: Bokeh Lessons (https://www.datacamp.com/courses/interactive-data-visualization-with-bokeh).  You can embed a static visualization in a django template link (http://stackoverflow.com/questions/29508958/how-to-embed-standalone-bokeh-graphs-into-django-templates/29524050#29524050).  There is bokeh-server that will let you create dynamic charts and graphs.  I have read that you can build things out to leverage django and bokeh-serve to render dynamic visualizations.\n\nMaybe someone else in Penny U has done the dynamic visualizations in django.  If so I would love to hear how that works.\n\nJames: I am up for learning and willing to discuss the little that I have learned from datacamp.\n\nChad\n\n",
        "date": "2017-02-06T06:54:08-08:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "There's also Pycharts https://pypi.python.org/pypi/PyChart if you want to get something up quick with python - i know a little D3 but i'm sure there's some D3 gurus on here who could help you more than i could :)\n\n",
        "date": "2017-02-06T07:12:40-08:00",
        "user": "beck@eventbrite.com"
      },
      {
        "content": "For visualization in the front-end, I can't recommend enough http://recharts.org which is a React wrapper around D3. I find it provides elegantly combines the expressiveness of React and the power of D3. Out of the box it ships with charts that are either impossible in other packages or very difficult.\n\nScott",
        "date": "2017-02-06T17:24:12-08:00",
        "user": "scott.s.burns@gmail.com"
      },
      {
        "content": "So, a little bit more background on what I'm developing in. I'm basically doing just Javascript with a PHP backend. Not my choice, but I'm just working with what I have. Does Bokeh export to JS, so that it can connect to an API to pull data?\n\n",
        "date": "2017-02-06T19:22:54-08:00",
        "user": "almostsurelyape@gmail.com"
      },
      {
        "content": "Thanks for the recommendation. Recharts looks pretty promising, and just pretty in general. I'll definitely dig into it some.\n\n",
        "date": "2017-02-06T19:28:35-08:00",
        "user": "almostsurelyape@gmail.com"
      },
      {
        "content": "Would anyone like to set up a Penny Chat with James and help him along?\n\nJames, if you're willing to wait a few weeks, I'll be back from my upcoming San Francisco trip and I can pair program on something.\n\nI've done some D3 in the past:\n\nhttp://bl.ocks.org/JnBrymn/2926511\nhttp://bl.ocks.org/JnBrymn-EB/0c7efb0b9389ca707992\nhttp://bl.ocks.org/JnBrymn-EB/8b54c6def88d2640fb8c\nhttp://bl.ocks.org/JnBrymn-EB/5c3709ef137e6b009ac5\n\nBut this is mostly flexing my math knowledge and not really taking use of all the D3 has to offer. Nevertheless, I'd be happy to set down with you and get reacquainted to D3 (and to Javascript) again. My email's in our fancy schmancy directory (https://docs.google.com/spreadsheets/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing), so you can contact me directly.\n\nNo matter what you decide, read this: https://bost.ocks.org/mike/join/ It's short and it it the most succinct summary of how D3 works.\n\n-J\n",
        "date": "2017-02-07T06:07:48-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "\nIf you do set up a Penny Chat, I would love to be a part of that conversation.  Even if it is as a silent participant, it would be a nice thing for me to dip my toes into D3.\n\n",
        "date": "2017-02-07T06:46:30-08:00",
        "user": "upjohnc@gmail.com"
      }
    ],
    "id": 16
  },
  {
    "title": "Greetings Penny University Early Adopters",
    "description": "",
    "date": "2017-02-06T13:53:51-08:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "This weekend marks an important early event in the history of Penny University - we have hit 100 community members. Congratulations, if you are reading this email, *then you are an early adopter!*\n\nBut along with our rapid growth has come some growing pains. Occasionally the digest emails are too long to comfortably read, and members are missing out Penny Chats that might interest them. In response we are trying something new: Introducing the Penny University Slack Team - join the slack team here. (https://penny-university.slack.com/shared_invite/MTM3NjIyNjY1NzAwLTE0ODYzOTUyNjUtM2M4NDgxYjEzMQ) (That link is valid for 1 week.)\n\nBecause of our growing pains, I'm also going to make a very unusual request of you: DO NOT INVITE NEW PEOPLE! Yep, you heard me correctly. We want to make sure that we have a stable and usable infrastructure in place so that when we do the next big membership drive (a few weeks from now) that it will continue to be a good experience for everyone.\n\n\n*\"What should we do in the meantime?\"*\nWhy, I'm glad you asked! It's time to set up your first Penny Chat. With roughly 1/3 of our members *also* signed up as teachers, there are plenty of people that can help teach you something new. So go now, find an interesting topic in the Penny University Directory (https://docs.google.com/spreadsheets/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing), reach out to the individual, and set up a time to meet. (You should also consider signing up to teach (https://docs.google.com/forms/d/e/1FAIpQLSfzhGHFivL7xfxMJvdrXfiPy132nSIL8Lzaxsk3t0cjiSo-wg/viewform)\n.)\n\nThat's it! Now go out and LEARN and TEACH!\n",
        "date": "2017-02-06T13:53:51-08:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 17
  },
  {
    "title": "Review: Tests in Django",
    "description": "",
    "date": "2017-02-06T16:31:29-08:00",
    "user": "anthonyfox1988@gmail.com",
    "followups": [
      {
        "content": "When Chad posted about wanting to know more about Test Driven Development in Django, I said to myself.. \"hey, I'm not completely clueless in this area. I think I can help.\" Max and Scott saw the topic and joined in as well. Then Chris and Nicole did too! We talked a bit over the weekend while at PyTn (great conference) and ultimately decided to meet up at Cinco De Mayo Monday (today) at 11 am. \nCome 10:45, Scott Burns, Chris Graffagnino, Nicole Dominguez, and myself loaded into my incredibly fast 2010 Toyota Corolla *Sport* (0 - 60 in less than a minute, probably) and drove to Cummins station. We had a few issues finding parking. Mostly due to a massive dumpster fire and the entirety of Cummins Station being *EVACUATED*. We agreed to go to Whiskey Kitchen instead... \nAt Whiskey Kitchen, we had a great discussion involving fundamental principles of TDD. Where to draw the lines. How to convince the nonbelievers. And common techniques to make it easy to obey the testing goat. I also lent Chad my Test Driven Development book. Thanks to Chad providing a useful scenario I was also able to write up a quick Django app that shows a very simple implementation of testing import functionality. \nhttps://github.com/WTFox/pennyu/tree/master/pennyu_projects (Not for use in production)\n\n`importapp/tests.py, utils.py, and views.py` are of interest in regards to today's topic.\n\nThis and any future PennyU projects will be stored in a public repo on my GitHub profile named PennyU. \nOverall:\n\n   - Discussion: 10/10\n   - Company: 10/10\n   - Dumpster Fire: 10/10\n   ",
        "date": "2017-02-06T16:31:29-08:00",
        "user": "anthonyfox1988@gmail.com"
      },
      {
        "content": "I'll need to add my lessons learned or takeaways.  But two things first:\n\n1) the dumpster fire is real.  It happened when a truck's cab that was parked next to the building caught on fire and subsequently jumped to the dumpster.  *Lesson learned*: when you have the chance to take a picture of an actual dumpster fire you should so that you can add a real picture in your next presentation.  It would be so much better than a hand-drawn picture.\n\n2) I have seen the Corolla Sport in real life.  I can not vouch to it's zero to sixty time because I didn't pull out the stopwatch on my iphone quickly enough, but it did move fast.\n\n",
        "date": "2017-02-06T16:44:39-08:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "\n\n>From Twitter:\n\n(https://lh3.googleusercontent.com/-96e5cQu2qPo/WJkZ2rxEgYI/AAAAAAABaeQ/zf_Yrh-qo2QKC3tOQbXwyp_52mYj6oDjgCLcB/s1600/truck-fire.jpg)\n\n\n",
        "date": "2017-02-06T16:51:02-08:00",
        "user": "anthonyfox1988@gmail.com"
      },
      {
        "content": "In the process of asking about testing, Anthony introduced me to TDD and a book called TDD with Python.  The author follows a strict process of write the test and then write code until the test pass.\n\n\n   - - My first question is how strictly does one adhere\n   - Scott Burn's opinion is that until you have thought through how to    solve the problem, you don't know what you need to test for.  Additionally,    he pointed out that writing code is 'expensive' so taking the time to    define the solution and then write the tests around that solution is more    valuable.\n   - Second question was about trade off because there is always a trade off\n   - The response to this question was level of importance.\n   - For instance:\n  - login page for all users vs. an internal app that 4 people use.\n  - For the internal app you can say 'hey, sorry.  I know how to fix   that'\n   \nIn a separate conversation at PyTN, we were discussing using float vs decimal for money.  Eric Appelt said he was working on an old code base and had to use float to get older unit tests to pass.  He couldn't get an answer from the business on the reason behind the tests.  Eric's example showed the long-term value of unit tests.\n\n",
        "date": "2017-02-07T05:34:19-08:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "Damn! I stumbled upon this post a little too late. I'm currently a student at Nashville Software School with about 6 weeks until graduation. My cohort is working with Python and Django in the back end of things. I'd love to get in on another meet up about testing and TDD if it anyone is interesting in doing another.\n",
        "date": "2017-02-10T07:33:29-08:00",
        "user": "mattm.eternal@gmail.com"
      },
      {
        "content": "I echo what Matt said!  He is a classmate in my cohort at Nashville Software School.  I would be interested in doing another TDD meeting.  It helps me to gain new perspectives and learn through different modalities.  TDD is a beast to grok!\n\n",
        "date": "2017-02-10T07:37:05-08:00",
        "user": "alex.simonian@gmail.com"
      },
      {
        "content": "Had another discussion on testing in Python.  The one major takeaway is to test the function's intended behavior.  In the example we worked through this came out as testing the different decision points.  The best way to understand it is the different directions of if statements.  In other words, what is the intended behavior from `if len(string) > 10:`, test that happens.  The other thing to put a test on is third party responses.  I am finding it hard to explain but it is testing what your code will do if certain responses from a third party happen.  So if the third party doesn't respond in x-time or just isn't available.\n\nTalked also about mocks, stub, and fakes.  Note the slides in the presentation: https://github.com/jasonamyers/pyohio2016-for-those-about-to-mock/blob/master/presentation.pdf\n\nSide note: somehow talking to triple-cookie expands my knowledge and understanding of the subject and subsequently reveals something that I should add to my list of things to learn.\n\n",
        "date": "2017-02-17T13:53:48-08:00",
        "user": "upjohnc@gmail.com"
      }
    ],
    "id": 18
  },
  {
    "title": "Really Understand Functional Programming",
    "description": "",
    "date": "2017-02-08T19:21:01-08:00",
    "user": "shenfieldmax@gmail.com",
    "followups": [
      {
        "content": "I've been interested in functional programming for for a few years, I know a few basic concepts well, including persistent data structures and second order functions, and a functional language.\n\nI want to set some mental boundaries for myself about what functional programming is and isn't, and understand its concepts in terms of tradeoffs instead of dogma or hype.\n\nThere are a lot of ideas listed in this document: http://lambdaconf.us/downloads/documents/lambdaconf_slfp.pdf. It had a rocky first incarnation, but it seems like a valuable catalog of ideas within functional programming.  Does anyone have any other resources, advice, or wisdom about the nature of functional programming? Or just an interest to get together and learn in a focused way with me?\n",
        "date": "2017-02-08T19:21:01-08:00",
        "user": "shenfieldmax@gmail.com"
      },
      {
        "content": "I also have an interest in functional programming. At the behest of a former colleague I jumped into learning haskell. I used codewars.com programming challenges (https://www.codewars.com/users/rennat), the website Learn You a Haskell for Great Good! (http://learnyouahaskell.com/), and the hoogle search engine (https://www.haskell.org/hoogle/) to get somewhat familiar with it and how to approach things in a strictly functional language. I'm far from an expert and most would hesitate to call me proficient in it, including myself, but I find it entertaining and my python has definitely become more organized and testable as a result.\n\nTest driven code challenges make for good pair/small group programming sessions for a group of people interested in learning the thing. I would be down to spend an hour or so learning by doing if that interests anyone else here.\n\n\n",
        "date": "2017-02-08T19:55:37-08:00",
        "user": "tannern@gmail.com"
      },
      {
        "content": "Sign me up!!!!  I got hooked into functional programming at the last FP\nMeetup.  My experience so far has been with Clojure and going through\nthe Clojure\nKoans (http://clojurekoans.com/).  There is a nice walk through\n(https://www.youtube.com/watch?v=P6S_1nCfjWA&list=PL1p6TgkbKXqyOwq6iSkce_EY5YWFHciHt)\nthat helps as you go along.\n\n",
        "date": "2017-02-08T22:16:36-06:00",
        "user": "daynewright.dev@gmail.com"
      },
      {
        "content": "Max\n\nIf you get together, I would love to listen in whether it's in person or on hangout.  I haven't dug into the topic so I'd be more interested in hearing what others say.\n\n",
        "date": "2017-02-09T05:01:14-08:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "I would be up for a hangout.\n\n",
        "date": "2017-02-09T07:02:12-08:00",
        "user": "ryan@noisepuzzle.com"
      },
      {
        "content": "https://medium.com/javascript-scene/master-the-javascript-interview-what-is-functional-programming-7f218c68b3a0#.1wgk0w7tw\n\nThat is probably the best non-hyped article I've read on FP ever.  There aren't many /pure/ functional languages out there (Haskell?). But lots of languages have functional features.  I grew up treating Python like a functional language, and even now avoid OO in Python. The big gotchas in Python's functional paradigm are side effects and mutability.\n\nI'd love to do some kind of meetup or hangout about FP. Just tell me when and I'll try to make my schedule accommodate. :-)\n\n",
        "date": "2017-02-09T07:33:12-08:00",
        "user": "eeachh@gmail.com"
      },
      {
        "content": "That article had exactly what I was looking for.\n\nFunctional programming (often abbreviated FP) is the process of building > software by composing pure functions, avoiding shared state, mutable data, > and side-effects. Functional programming is declarative rather than > imperative, and application state flows through pure functions. Contrast > with object oriented programming, where application state is usually shared > and colocated with methods in objects.\n> Functional programming is a programming paradigm, meaning that it is a way > of thinking about software construction based on some fundamental, defining > principles (listed above). Other examples of programming paradigms include > object oriented programming and procedural programming.\n\n\nThanks (the rest of the article was also good).\n\nI'd like to get together to work through an hour of exercises on Code Wars (or koans of choice) and ask questions.  I'm free Wednesday at 8 or 9 am next week? \n",
        "date": "2017-02-09T18:45:04-08:00",
        "user": "shenfieldmax@gmail.com"
      },
      {
        "content": "I'd love to dive deeper with FP as well.  I recently started working with Clojure, but am up for discussion or koans with any other language.  Wednesday at 8am works for me if we go the hangout route.\n",
        "date": "2017-02-09T19:20:27-08:00",
        "user": "timcreasy@cicayda.com"
      },
      {
        "content": "Definitely want to join in if you get together on Wednesday either hangout\nor meetup.  Just let me know the details.\n\n",
        "date": "2017-02-09T22:46:02-06:00",
        "user": "daynewright.dev@gmail.com"
      },
      {
        "content": "**shamelessly plugs functional programming talk he's giving next week**\n\nhttps://www.meetup.com/nashville-php/events/237525601/ (https://www.google.com/url?q=https%3A%2F%2Fwww.meetup.com%2Fnashville-php%2Fevents%2F237525601%2F&sa=D&usd=2&usg=AFQjCNGFQsaKWL1GYN_qdICn_EKo_6c-BA)\n",
        "date": "2017-02-10T05:14:53-08:00",
        "user": "bradley.wogsland@gmail.com"
      },
      {
        "content": "",
        "date": "2017-02-11T09:10:15-08:00",
        "user": "jason.orendorff@gmail.com"
      },
      {
        "content": "I'm grateful for the thoughtful answer.\n\nWe've got a little coordination going on the Penny U Slack. ATM it looks like we're meeting on Wednesday, 9 A.M at Slow Hand, and via a google hangout (https://hangouts.google.com/call/fhmotu5l2jg5rffej2nghsc2vue).\n\nI really like the idea of learning about a bit of systems build with functional programming ideas in mind.  Maybe we could meet again the week after, to explore that angle, with each person exploring a bit of a system built with FP principles? Redux might provide another example, define state as a function of an infinite sequence of actions.\n",
        "date": "2017-02-11T15:34:39-08:00",
        "user": "shenfieldmax@gmail.com"
      },
      {
        "content": "I am also interested in increase my knowledge around FP.  I'm also interested in learning Clojure (read a book on it a few months ago and learn a little bit but got busy).  I mostly want to learn to gain new perspective.  I'd also be up for a hangout on Wednesday to listen in on the conversation.\n\n",
        "date": "2017-02-12T04:49:39-08:00",
        "user": "daniel.j.aquino@gmail.com"
      },
      {
        "content": "Link to our discussion this morning - https://www.youtube.com/watch?v=3tAKZH9lyck\n",
        "date": "2017-02-15T08:14:47-08:00",
        "user": "shenfieldmax@gmail.com"
      },
      {
        "content": "Any highlights from the discussion?\n",
        "date": "2017-02-17T06:46:41-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "In my naive opinion, the ideal of a pure function is core to FP.  I am sure that someone like Wilkes Joiner will tell me that I am shortsighted.  The idea that you call a function and it doesn't have any side effects which you didn't know about or have to account for in your own code. \nI read the blog post: https://www.google.com/url?q=https%3A%2F%2Fmedium.com%2Fjavascript-scene%2Fmaster-the-javascript-interview-what-is-functional-programming-7f218c68b3a0%23.1wgk0w7tw&sa=D&sntz=1&usg=AFQjCNG7vUxDknwMix_VksbaqNhSHNpk-A\nIt is in an early post in this discussion string.  I found value in that it gave the basis of FP and links to deeper explanation.\n\nIf there would be a second discussion on this, I would like to hear how people have leveraged the knowledge or ideals of FP in Python.\n\nLesson learned: don't do a recorded google hangout at Slow Hand.\n\n",
        "date": "2017-02-17T11:27:55-08:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "Tim shared his experience using Clojure full time at Cicayda.   We briefly discussed the the \"boundaries\" of functional programming outlined in the article Harrison shared.\n\nAt the end we dived into a CodeWars challenge using Clojure.  Also, John had observed how a Lisp syntax forced programmers to read from the inside out, which could be challenging.\n\n",
        "date": "2017-02-19T12:39:02-08:00",
        "user": "shenfieldmax@gmail.com"
      }
    ],
    "id": 19
  },
  {
    "title": "Data Nerds is once a month data science group that ya'll should come to",
    "description": "",
    "date": "2017-02-10T08:49:03-08:00",
    "user": "ccummings@eventbrite.com",
    "followups": [
      {
        "content": "Hi everyone,\n\nWe've been putting together a small data science meet up that gets together once a month to learn from each other, and talk all things data science. We're still pretty small, and just finding our groove of our order of operations. So we'd like to extend an invite to any Nashville Penny-U'ers to join us.\n\nHere's what happens at one of these meet ups:\n\n   1. Drink coffee\n   2. Lightning round where each person talks about what they're learning or have learned about data sciencey stuff since we last met\n   3. Book discussion\n   4. Data Nerds show and tell\n   5. ???\n\nWe're just about to start An Introduction to Statistical Learning (http://www-bcf.usc.edu/~gareth/ISL/ISLR%20First%20Printing.pdf) and are aiming to get through 4 to 5 chapters per meet up.\nIf you're interested in these topics, please join us for our next meet up on *Tuesday, February 14* (yes, Valentines Day <3). We're beginner friendly!\n\nLocation (https://www.google.com/maps/place/Cummins+Station,+209+10th+Ave+S,+Nashville,+TN+37203/@36.15515,-86.7847584,17z/data=!3m1!4b1!4m5!3m4!1s0x886466f54dbef463:0x9f7aa60fb56751c2!8m2!3d36.1551649!4d-86.7825589)\nEventbrite Nashville\n209 10th Ave\nSuite 300\nNashville, TN 37203\n\nNext meet up is on *Tuesday, February 14th*.\n",
        "date": "2017-02-10T08:49:03-08:00",
        "user": "ccummings@eventbrite.com"
      },
      {
        "content": "Whoops, sorry I forgot the time.\n\n9:00 am - 10:00 am\n\n",
        "date": "2017-02-10T09:07:03-08:00",
        "user": "ccummings@eventbrite.com"
      },
      {
        "content": "What time?\n\n\nOn February 10, 2017 at 10:49:04 AM, ccummings (ccummings@eventbrite.com)\nwrote:\n\nHi everyone,\n\nWe've been putting together a small data science meet up that gets together\nonce a month to learn from each other, and talk all things data science.\nWe're still pretty small, and just finding our groove of our order of\noperations. So we'd like to extend an invite to any Nashville Penny-U'ers\nto join us.\n\nHere's what happens at one of these meet ups:\n\n   1. Drink coffee\n   2. Lightning round where each person talks about what they're learning\n   or have learned about data sciencey stuff since we last met\n   3. Book discussion\n   4. Data Nerds show and tell\n   5. ???\n\nWe're just about to start An Introduction to Statistical Learning\n(http://www-bcf.usc.edu/~gareth/ISL/ISLR%20First%20Printing.pdf) and are\naiming to get through 4 to 5 chapters per meet up.\nIf you're interested in these topics, please join us for our next meet up\non *Tuesday, February 14* (yes, Valentines Day <3). We're beginner friendly!\n\nLocation\n(https://www.google.com/maps/place/Cummins+Station,+209+10th+Ave+S,+Nashville,+TN+37203/@36.15515,-86.7847584,17z/data=!3m1!4b1!4m5!3m4!1s0x886466f54dbef463:0x9f7aa60fb56751c2!8m2!3d36.1551649!4d-86.7825589)\nEventbrite Nashville\n209 10th Ave\nSuite 300\nNashville, TN 37203\n\nNext meet up is on *Tuesday, February 14th*.\n--\nYou received this message because you are subscribed to the Google Groups\n\"Penny University\" group.\nTo unsubscribe from this group and stop receiving emails from it, send an\nemail to penny-university+unsubscribe@googlegroups.com.\nTo view this discussion on the web visit\nhttps://groups.google.com/d/msgid/penny-university/538827f5-0e74-439c-b8ec-af738e41e9ab%40googlegroups.com\n(https://groups.google.com/d/msgid/penny-university/538827f5-0e74-439c-b8ec-af738e41e9ab%40googlegroups.com?utm_medium=email&utm_source=footer)\n.\nFor more options, visit https://groups.google.com/d/optout.\n",
        "date": "2017-02-10T11:52:46-05:00",
        "user": "jason@mailthemyers.com"
      },
      {
        "content": "",
        "date": "2017-02-11T09:56:42-08:00",
        "user": "jason.orendorff@gmail.com"
      }
    ],
    "id": 20
  },
  {
    "title": "Help with Chef?",
    "description": "",
    "date": "2017-02-12T09:39:46-08:00",
    "user": "jstoebel@gmail.com",
    "followups": [
      {
        "content": "I hope this is the correct place to ask this question. I am starting to learn Chef and I have some questions, both nitty-gritty (how do I do ___) and philosophical (what is the advisable way to achieve ___). Would anyone be up for a chat for a half an hour or so? I live in Kentucky so likely it would need to be over Skype.\n\nAnd if this question is better phrased through a different channel, please let me know.\n",
        "date": "2017-02-12T09:39:46-08:00",
        "user": "jstoebel@gmail.com"
      },
      {
        "content": "Hey! \nYes, this is a fine place to ask your question. There are three ways to \"ask\" in Penny University\n\n   - The preferred method: Ask a \"teacher\" by looking them up in our directory (https://docs.google.com/spreadsheets/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and then contacting them directly. (Unfortunately I didn't see any Chef teachers when I looked.)\n   - Next you can ask on our Slack channel (you should have been invited - tell me if you need me to invite you again).\n   - Next you can ask just like you did in the forum.\n\nUnfortunately I can't help you directly. I've only touched Chef once :P. If I can find someone that can help I'll send them this way.\n\nOh... if you can, consider recording your discussion (https://support.google.com/youtube/answer/7083786). We're hoping to build up a list of video Penny Chats that we can direct people to in the future.\n\n~Enjoy Penny U~\n",
        "date": "2017-02-12T10:12:58-08:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 21
  },
  {
    "title": "Penny University Featured Teachers",
    "description": "",
    "date": "2017-02-12T16:01:44-08:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "Greetings Penny Scholars,\n\nThis week Penny University introduces something new - *featured teachers*. This week we have 2:\n\n¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢\n\n*Simon Willison* is a co-founder of the social conference directory Lanyrd (http://lanyard.com/), and Director of Architecture at Eventbrite. Simon is also a *co-creator of the Django Web framework* (*you read that correctly*). Check it out, Simon's even got his own Wikipedia page (https://en.wikipedia.org/wiki/Simon_Willison). Fancy!\n\nSimon has signed up to teach \"Python, Django, SOA, APIv3, elasticsearch, DB design, social software design, rapid prototyping, redis\" and is available for \"Roughly 1 hour a week\"\n\n¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢\n\n*Courey Elliott* is a Software Engineer at Emma with a love of natural language processing. Courey was one of the key-note speakers at this year's PyTennessee, is a regular personality on NashDev podcast (http://nashdevcast.com/), ... and is a fun person to talk with over lunch.\n\nCourey has signed up to teach \"Domain Driven Design, OOP, micro (raspberrypi or arduino)\" and is available for \"2 hours-ish a week, lunch time or weekends\"\n\n¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢\n\nAs members of Penny University you have access to them! Just look them up in our Teacher Directory (https://docs.google.com/spreadsheets/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and reach out write them an email. But be quick! You can see that their weekly availability is only a couple of hours.\n\nAnd whenever you have your Penny Chat, then make sure to post back to Penny University so that we can all learn a little from your experience. (OR you can write a blog post like Anthony Fox did this week! (http://anthonyfox.io/2017/02/pennyu-tests-in-django/) Hurray!)\n\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-02-12T16:01:44-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nThis week Penny University introduces two new featured teachers:\n\n¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢\n\n*Steve Brownlee*, Lead Instructor at Nashville Software School, is dedicated to helping teach the next generation of software developers by providing people with a solid understand of the core technologies used today, and then expanding into how to be a valuable contributor.\n\nSteve has been developing software since 1980, when he programmed his TRS-80 to do his math homework for him. Since then, he grew up with the world wide web explosion and discovering all the new technologies that got invented to exploit its capabilities. Decades years later, he wants to take all the knowledge and skills he has accumulated and teach a new generation to build software with passion, creativity, and strong foundations.\n\nSteve has signed up to teach too many things to list and is available \"2-3 hours per week. Occasionally a lunch here and there\"\n\n¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢\n\n*Doug Turnbull* (my coauthor! (https://www.amazon.com/Relevant-Search-applications-Solr-Elasticsearch/dp/161729277X)\n) works with Solr and Elasticsearch. He tries to make search smarter. He helps folks with search-driven apps from traditional search to recommendations to whatever else you can imagine requiring a smart search engine to answer questions.\n\nDoug has signed up to teach \"Search, Machine Learning, Data Science\" and is available for 2 hours per week in the evenings.\n\n¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢\n\nAs members of Penny University you have access to these teachers! Just look them up in our Teacher Directory (https://docs.google.com/spreadsheets/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and reach out write them an email. But be quick! You can see that their weekly availability is only a couple of hours.\n\nAnd whenever you have your Penny Chat, then make sure to post back to Penny University so that we can all learn a little from your experience.\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-02-19T18:37:49-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nThis week Penny University introduces a new featured teacher: *Matt Hamil*.\n\n¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢\n\n*Matt Hamil* is a Software Development Engineer working at Spera Health where he works on a React Native mobile app. He loves all things front-end and is a contributor of two open source projects: Hedron, a no-frills flex grid system for React (https://github.com/JSBros/hedron), and uiGradients, a quick and easy utility to create gradient backgrounds for React (https://github.com/JSBros/uigradients).\n\n¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢\n\nAs members of Penny University you have access to these teachers! Just look them up in our Teacher Directory (https://docs.google.com/spreadsheets/u/1/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and reach out write them an email. But be quick! You can see that their weekly availability is only a couple of hours.\n\nAnd whenever you have your Penny Chat, then make sure to post back to Penny University (https://groups.google.com/forum/#!forum/penny-university) so that we can all learn a little from your experience.\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-02-26T17:38:35-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nThis week Penny University introduces a new featured teacher: *Anthony Fox*.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\n*Anthony Fox* works at Stratasan during the day. There, he’s a software engineer and works with a crack team of developers to build cutting edge software and do other totally normal dev stuff. At night, he throws on his heroic leotard and either cuddles up with a book by candle light, or assembles all of his IoT micro controllers and further plot his eventual plan to TAKE OVER THE WORLD (http://anthonyfox.io/2017/02/automating-christmas-with-particle-docker-and-siri/)! He hates talking about himself in the 3rd person. Screw it, it’s me! That’s right! It’s been me the entire time!\n\nAnthony is signed up to teach:\n\n   - \"Fundamental programming concepts. (Familiar)\n   - Idiomatic python (Basic to Intermediate)\n   - Beginning web dev w/ python (familiar with Django and Flask)\n   - Dev tools such as using git for collab and other tools\n   - Fun stuff like accessing api’s.\n   - And I’m always up for researching a problem together\"\n   Anthony is available roughly an hour or 2 per week during lunch hours.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\nAs members of Penny University you have access to these teachers! Just look them up in our Teacher Directory (https://docs.google.com/spreadsheets/u/1/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and reach out write them an email. But be quick! You can see that their weekly availability is only a couple of hours.\n\nAnd whenever you have your Penny Chat, then make sure to post back to Penny University (https://groups.google.com/forum/#!forum/penny-university) so that we can all learn a little from your experience.\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-03-05T15:10:18-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "This week Penny University introduces a new featured teacher: *Chris Cummings*.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\n*Chris Cummings* is fairly new to the computer science world coming from a background in small time entrepreneurship, finance, and economics. Since he started at Eventbrite nearly 3 years ago, data science, specifically machine learning and artificial intelligence has become a chief interest for Chris. In pursuit of practical data science skills, Chris has worked worked tirelessly over the past two years to build a foundation of development skills by writing small projects in C-based languages including C, Go, Java, Javascript, Python, and Swift. Chris also enjoy hacking on front end stuff with React, including React Native.\n\nChris is happy to teach introductory programming and discuss his approach to learning. Additionally Chris invites you to Data Nerds, a monthly data science meetup hosted at Eventbrite.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\nAs members of Penny University you have access to our teachers! Just look them up in the Teacher Directory (https://docs.google.com/spreadsheets/u/1/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and reach out them in email or in our Slack channel.\n\nAnd whenever you have your Penny Chat, then make sure to post back to Penny University (https://groups.google.com/forum/#!forum/penny-university) so that we can all learn a little from your experience.\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-03-12T14:23:21-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "This week Penny University introduces a new featured teacher: *Max Shenfield*.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\n*Max Shenfield* majored in Mathematics at Belmont University, and after a year and a half programming .NET at a small healthcare shop he joined Eventbrite.  As a part of the Financial Foundry team at Eventbrite, Max works with a small group of people dedicated to improving the quality and flexibility of Eventbrite's global ticketing marketplace.  Max loves working in Python, and also spends some of his free time figuring out how technology can improve society with Code for Nashville (http://codefornashville.org/).\n\nMax is signed up to teach Functional Programming, Civic Hacking, and Accounting Systems. And is available an hour a week during most weekday mornings and afternoons.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\nAs members of Penny University you have access to our teachers! Just look them up in the Teacher Directory (https://docs.google.com/spreadsheets/u/1/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and reach out them in email or in our Slack channel.\n\nAnd whenever you have your Penny Chat, then make sure to post back to Penny University (https://groups.google.com/forum/#!forum/penny-university) so that we can all learn a little from your experience.\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-03-19T12:10:55-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nThis week Penny University introduces a new featured teacher: *Mike Schuld*.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\n*Mike Schuld* is the Lead Product Architect at Foundant Technologies in Bozeman, Montana. Foundant provides software for Foundations and Nonprofits which allows them to better manage their grant applications. Mike has been writing code since about age 12, starting with simple websites and graphics coding and moving on through ASP, PHP, C++, Java, Perl and C#. His main focus nowadays is in the C# (.Net) based web and graphics programming world, but he also likes to play around with new frameworks and languages in his spare time.\n\nMike is available for hangout or screen sharing over weekends.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\nAs members of Penny University you have access to our teachers! Just look them up in the Teacher Directory (https://docs.google.com/spreadsheets/u/1/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and reach out them in email or in our Slack channel.\n\nAnd whenever you have your Penny Chat, then make sure to post back to Penny University (https://groups.google.com/forum/#!forum/penny-university) so that we can all learn a little from your experience.\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-03-26T13:40:55-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nThis week Penny University introduces a new featured teacher: *Chang Lee*.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\n*Chang Lee* is a PhD student in mathematics at Vanderbilt. Chang has taught calculus, linear algebra, stats in the past and is teaching R programming this semester. Chang's experience has been mostly inside of academia, but he did have the opportunity to do data science for a baseball team last summer. Chang is interested in machine learning, data science, math, and sports analytics. If anyone needs help with explaining math ideas Chang can probably help!\n\nChange is available one or two hours a week in the morning hours Monday through Friday.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\nAs members of Penny University you have access to our teachers! Just look them up in the Teacher Directory (https://docs.google.com/spreadsheets/u/1/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and reach out them in email or in our Slack channel.\n\nAnd whenever you have your Penny Chat, then make sure to post back to Penny University (https://groups.google.com/forum/#!forum/penny-university) so that we can all learn a little from your experience.\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-04-02T19:14:48-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nThis week Penny University introduces a new featured teacher: *Peter Swan*.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\n*Peter Swan* has worked in web development since prototype and scriptaculous were cool and IE6 compatibility was a full time job. He's worked at startups for the past 8 years, first for indabamusic.com and most recently for gust.com (remotely). Peter is interested in building correct, maintainable systems and making the right thing easy which has resulted in some expertise in TDD/BDD, some strong opinions around API design, a healthy hate/love relationship with Ruby and Javascript, an appreciation of automated infrastructure, and an infatuation with strongly typed functional programming.\n\nPeter is available for a couple hours a week during lunch breaks or after 8PM.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\nAs members of Penny University you have access to our teachers! Just look them up in the Teacher Directory (https://docs.google.com/spreadsheets/u/1/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and reach out them in email or in our Slack channel.\n\nAnd whenever you have your Penny Chat, then make sure to post back to Penny University (https://groups.google.com/forum/#!forum/penny-university) so that we can all learn a little from your experience.\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-04-09T16:46:19-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nThis week Penny University introduces a new featured teacher: *Chris Graffagnino*.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\n*Chris Graffagnino* is a software engineer at Stratasan. He made the jump from musician to developer in about 2000 hours using free online resources, and is excited to help aspiring devs to the same. Chris writes Python/Django code on a daily basis, and wants to improve his knowlege of ES6/React/Redux.\n\nChris is signed up to teach Python, Django, Unit Testing, Front-end, Git, guitar, music theory and is available for 1-2 hours a week during lunchtimes.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\nAs members of Penny University you have access to our teachers! Just look them up in the Teacher Directory (https://docs.google.com/spreadsheets/u/1/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and reach out them in email or in our Slack channel.\n\nAnd whenever you have your Penny Chat, then make sure to post back to Penny University (https://groups.google.com/forum/#!forum/penny-university) so that we can all learn a little from your experience.\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-04-16T20:23:23-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 22
  },
  {
    "title": "Computer Science 101",
    "description": "",
    "date": "2017-02-13T08:25:40-08:00",
    "user": "rittycheriah@gmail.com",
    "followups": [
      {
        "content": "Hallo All!\n\nI realize this might be a wide net to cast, but I wanted to see what everyone thought. Recently something I've been reflecting on is my lack of theoretical knowledge when it comes to the depth of a computer science degree. That being said, I have heard a lot of varying advice from \"just learn it when you need it\" to \"if you're really curious, find stuff online and here's a couple links\". As someone who really values depth and breadth, how and what should I start learning to help fill in the gaps that I didn't get to learn by going to a software bootcamp over a traditional four year degree in engineering, math, or computer science? \nWhat has really sparked my interest was working with a senior who had a math degree and could speak very intelligently about how languages work, interpreters, compilers, and how/why they work with the underlying hardware. How can I learn more about how to not just code well, but design well when it comes the blurred line between code & hardware? \nWould really appreciate anyone's thoughts, conversations, and any resources!\n",
        "date": "2017-02-13T08:25:40-08:00",
        "user": "rittycheriah@gmail.com"
      },
      {
        "content": "Hey Rainu,\n    So one resource I really like in this area is\nhttps://github.com/open-source-society/computer-science. It's a great place\nto get an idea of what is studied in Computer Science.\n\nCheers,\nJason\n\n\nOn February 13, 2017 at 10:25:41 AM, Rainu Ittycheriah (\nrittycheriah@gmail.com) wrote:\n\nHallo All!\n\nI realize this might be a wide net to cast, but I wanted to see what\neveryone thought. Recently something I've been reflecting on is my lack of\ntheoretical knowledge when it comes to the depth of a computer science\ndegree. That being said, I have heard a lot of varying advice from \"just\nlearn it when you need it\" to \"if you're really curious, find stuff online\nand here's a couple links\". As someone who really values depth and breadth,\nhow and what should I start learning to help fill in the gaps that I didn't\nget to learn by going to a software bootcamp over a traditional four year\ndegree in engineering, math, or computer science?\n\nWhat has really sparked my interest was working with a senior who had a\nmath degree and could speak very intelligently about how languages work,\ninterpreters, compilers, and how/why they work with the underlying\nhardware. How can I learn more about how to not just code well, but design\nwell when it comes the blurred line between code & hardware?\n\nWould really appreciate anyone's thoughts, conversations, and any resources!\n--\nYou received this message because you are subscribed to the Google Groups\n\"Penny University\" group.\nTo unsubscribe from this group and stop receiving emails from it, send an\nemail to penny-university+unsubscribe@googlegroups.com.\nTo view this discussion on the web visit\nhttps://groups.google.com/d/msgid/penny-university/a32cdac7-f51d-468d-b66d-dc3bf5aa081c%40googlegroups.com\n(https://groups.google.com/d/msgid/penny-university/a32cdac7-f51d-468d-b66d-dc3bf5aa081c%40googlegroups.com?utm_medium=email&utm_source=footer)\n.\nFor more options, visit https://groups.google.com/d/optout.\n",
        "date": "2017-02-13T08:28:46-08:00",
        "user": "jason@mailthemyers.com"
      },
      {
        "content": "Hey Rainu,\n\nI recently decided to go the academic route and would happily discuss how I made this decision in a google chat.  Feel free to message me.\n\nryan@noisepuzzle.com\n\n\n\n\n",
        "date": "2017-02-14T10:01:18-08:00",
        "user": "ryan@noisepuzzle.com"
      },
      {
        "content": "What courses would go on the priority queue in terms of bringing value to a company as a developer, given time as a constraint variable?  I am sure it is context dependent on the type of job, e.g. data science vs web developer, but I am talking in general terms.  My vote is for a solid foundation in data structures and algorithms first, with maybe design patterns or compilers second.  Would like to hear some thoughts from senior developers and architects.",
        "date": "2017-02-14T10:58:14-08:00",
        "user": "alex.simonian@gmail.com"
      },
      {
        "content": "Ping me on the Penny U Slack (@JnBrymn) and we can video chat for a few minutes. Or contact me next week when I'm back in town (jfberrymanⓐgmăil·com) and we can have coffee some morning. I want to get a sense of where you want to be and then I can give you my _opinions_ about how to get there.\n\nAlso - cultural note to everyone: Try to drive conversations toward real-life meetings if reasonable. The hope with Penny U is to build up a community where everyone knows each other on a personal level. If we stick to text, then we are recreating a very bad version of Stack Overflow :P\n",
        "date": "2017-02-15T06:59:38-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "",
        "date": "2017-02-15T17:15:52-08:00",
        "user": "jason.orendorff@gmail.com"
      },
      {
        "content": "Great chat with John and Rainu.  \nDefinitely a good idea to have a decent understanding of more of the theoretical computer science topics.  Below were some of the top priority topics, in lieu of formal computer science degree, to cover.\n\n\n   - OOP design patterns -- book recommendation (*Head First Design Patterns*) Knowledge of OOP design patterns helps to write reliable, scalable, testable, efficient, decoupled, modular... in short, well-written software that large teams can contribute and that stands the test of time.  Certain problems lend themselves well to specific design patterns.  Being able to spot and recognize these patterns in day-to-day work is useful for honing one's intuition of the problem domain. Some patterns can also lead to *problems *down the road.  The singleton is such an anti-pattern that can cause coupling issues.\n   - Algorithms and data structures - book recommendation (*Grokking Algorithms*)  Sort and search, data structures (trees, graphs, arrays, linked lists, hash tables), and the runtime/space complexity of algorithms and data structures Big O notation.  Systems programming relies heavily on the usage of data structures and algorithms.  For example, Git uses graphs and cryptography and Elasticsearch utilizes trees for search engine.  As an end user, you will have a deeper understanding of the various tradeoffs and know when and how to use them effectively for a particular application.  Understanding the overarching concepts of algorithms and DS and how they fit in with the big picture is what is helpful, rather than reciting each line of code for the particular algorithm.\n   - Other programming paradigms and languages -- static vs dynamic, functional, etc Go, Java, Haskell.  Each programming language has a set of unique strengths and some are more suitable than others, depending on the problem domain.  For example, huge messaging systems that require fast delivery and fault tolerance are very well suited to a language called Erlang, which was written to control telephone switches, this is why WhatApp was written in Erlang.  When performance is absolutely critical the fastest language is Assembly, but most people are too afraid of Assembly these days and choose to use C  / C++.  Java had it's hay day in the enterprise 10 years ago, but it exists today mainly to support those legacy systems.  It also seems to have a strong nice in search products, like elastic search and spark.  JavaScript is good at async execution, so there is no language that is best at all things, although Python is one that can do many things very well.  C extensions are the way to go in python, in terms of speed.  Also there is a lot of work currently being done to do JIT compilation for python, i.e. turn python code into C and compile it just before it executes, this can produce huge benefits in terms of speed.  The one main issue with C Python is the global interpreter lock.  This effectively keeps C for executing in parallel, i.e. true multiprocessor support (want to use all your cores, yo), although in most cases this can be worked around.   Other implementations like Jython (which is written on top of Java) don't have this issue so you get true multiprocessor support out of the box.\n\n\n\n",
        "date": "2017-02-21T22:15:52-08:00",
        "user": "alex.simonian@gmail.com"
      },
      {
        "content": "For me the conversation was a good refresher. I got to think through my own academic pursuits as a person who moved into software from a different career. For me academic pursuits fall into two overlapping categories 1) learning things because I realize that I need the knowledge 2) learning things because they are interesting and usually because they are somewhat adjacent to things that I needed to know. In my particular case, this meant reading blog posts, books, and Wikipedia articles.\n\nUltimately though the important takeaways were *rarely* the specifics of an algorithm or data structure. Instead they were a general knowledge of what is out there and how to think about the problem space. For instance, at different points I have had very specific knowledge about how different technologies work (Elasticsearch, Cassandra, Neo4j) but the most useful takeaway is the intuition about which technology applies better to which problem domain. Similarly I learned how various sorting and graph algorithms worked in the past. If I wanted to remember them I'd largely have to look them up again. But the takeaway was the ability to see how various types of things are done and the ability to take performance considerations into account.\n",
        "date": "2017-02-22T06:33:31-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "https://www.youtube.com/playlist?list=PL8dPuuaLjXtNlUrzyH5r6jN9ulIgZBpdo\n\nThis series just started, so I don't know what it will cover. In the preview they specify that it 'will not teach you how to program', but not much else. I don't know if that means it will simply be the history of computing, or if it will tackle topics like formal logic, analysis of algorithims, state machines, context-free grammars and all the other not-math things that were covered in my computer science education.\n\nI generally view a Crash Course series as the high school level of a topic. But my high school education was severely lacking in all but the most basic of computing topics, so I'm having trouble guessing at exactly what will be included. I just thought I'd drop it here as it has some potential and seemed on topic for this thread. :-)\n",
        "date": "2017-02-23T07:29:37-08:00",
        "user": "eeachh@gmail.com"
      },
      {
        "content": "Thanks for this conversation, everyone.   Very timely and helpful for me.\n\nI did study computer science (ages ago ;), but a lot of that \"theoretical\" knowledge has gotten pushed aside by the specific things I needed to know and use for given job assignments.   You do forget a lot of the things you studied when you don't use them in your day-to-day work  (or at least, I did...). \nBased on what I've been doing most on the job (writing code pretty close to the hardware), I cannot remember the last time I had a conversation at work about Big O notation and which optimal search and sort algorithms to use for various tasks/large data sets.   But solving a weird problem involving big/little endian-ness or boot performance issues related to entropy/random number generation on a \"factory fresh\" boot?  Those things I actually ran into, and the concepts stayed fresher.\n\nI'm recently back in the job market and spending a lot of time refreshing on a range of core CS topics.  One big tech company sent me a form letter/multi-page list of interview preparation tips and technical topics to review (yikes!).  I'm currently making my way though it.  Ping me if you want a copy -- includes much of what's been discussed here.  \n\n\nOff to study some more!  Appreciate the recommendations you all have made.  I am in the middle of \"Grokking Algorithms\" and love the presentation -- not overly \"academic\" and doesn't make my brain hurt  :)\n\nPeggy\n\n>\n>",
        "date": "2017-02-24T09:07:21-08:00",
        "user": "pegbertsch@gmail.com"
      },
      {
        "content": "I'd love to see that Peggy, just to see what employers think is valuable.\n\nCheers,\nJason\n\n\nOn February 24, 2017 at 11:07:34 AM, pegbertsch@gmail.com (\npegbertsch@gmail.com) wrote:\n\nThanks for this conversation, everyone.   Very timely and helpful for me.\n\nI did study computer science (ages ago ;), but a lot of that \"theoretical\"\nknowledge has gotten pushed aside by the specific things I needed to know\nand use for given job assignments.   You do forget a lot of the things you\nstudied when you don't use them in your day-to-day work  (or at least, I\ndid...).\n\nBased on what I've been doing most on the job (writing code pretty close to\nthe hardware), I cannot remember the last time I had a conversation at work\nabout Big O notation and which optimal search and sort algorithms to use\nfor various tasks/large data sets.   But solving a weird problem involving\nbig/little endian-ness or boot performance issues related to entropy/random\nnumber generation on a \"factory fresh\" boot?  Those things I actually ran\ninto, and the concepts stayed fresher.\n\nI'm recently back in the job market and spending a lot of time refreshing\non a range of core CS topics.  One big tech company sent me a form\nletter/multi-page list of interview preparation tips and technical topics\nto review (yikes!).  I'm currently making my way though it.  Ping me if you\nwant a copy -- includes much of what's been discussed here.\n\n\n\nOff to study some more!  Appreciate the recommendations you all have made.\nI am in the middle of \"Grokking Algorithms\" and love the presentation --\nnot overly \"academic\" and doesn't make my brain hurt  :)\n\nPeggy\n\n>\n> --\nYou received this message because you are subscribed to the Google Groups\n\"Penny University\" group.\nTo unsubscribe from this group and stop receiving emails from it, send an\nemail to penny-university+unsubscribe@googlegroups.com.\nTo view this discussion on the web visit\nhttps://groups.google.com/d/msgid/penny-university/245c9651-9d60-4c3e-bf51-f874da10003d%40googlegroups.com\n(https://groups.google.com/d/msgid/penny-university/245c9651-9d60-4c3e-bf51-f874da10003d%40googlegroups.com?utm_medium=email&utm_source=footer)\n.\nFor more options, visit https://groups.google.com/d/optout.\n",
        "date": "2017-02-24T12:13:27-05:00",
        "user": "jason@mailthemyers.com"
      },
      {
        "content": "I'd love to see the preparation tips and technical topics to review too Peggy. You can actually attach files to the topics here if you're open to that option.\n\n",
        "date": "2017-02-24T19:54:27-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": " A couple of people have inquired, so I'm posting a slightly scrubbed version of the interview prep doc here.   \n\n",
        "date": "2017-02-25T16:29:10-08:00",
        "user": "pegbertsch@gmail.com"
      },
      {
        "content": "Great thread! There have been some really great and educational contributions here.\nThanks for sharing this document Peggy.",
        "date": "2017-02-26T05:45:55-08:00",
        "user": "markellisdev@gmail.com"
      },
      {
        "content": "@jo\n\nReally like your response. The focus on learning with other people was a good reminder for me.\n\n-blbradley\n\n",
        "date": "2017-03-01T08:09:30-08:00",
        "user": "bradleytastic@gmail.com"
      },
      {
        "content": "",
        "date": "2017-03-01T11:38:34-08:00",
        "user": "leechanghsin@gmail.com"
      },
      {
        "content": "The best book that was recommended to me as an introduction to Comp Sci for those of us who may have a degree from another field is *Imposter's Handbook *by Rob Conery.\n\nThis book covers all the essential topics you would find in a strong comp sci program at a University.  You get the TL;DR on topics such as complexity theory, big O, lambda calculus, algorithms, databases, etc  Gain a broad understanding of what exists out there, so you can delve further if you so choose.  As we are all familiar, languages and frameworks come and go, but the broad principles of what you are essential doing in computer science remain as a body of knowledge.  I think Hal Abelson, who taught the Lisp course at MIT for years said it best that computer science is a horrible name for this discipline.  It is easy to confuse the tools with the essence of what you are doing.  Comp science could be best seen as a formal study that systematizes notions of how to do stuff.\n\nPersonally, I think it is best to perform the craft of programming for awhile (or in parallel with a degreed program), and then go back and explore the theory as a retrospective as to what you are doing.  Same can be said if you have a degree in economics or finance. They don't make you an economist or financial analyst without putting those ideas into practice.\n\n",
        "date": "2017-04-04T11:46:40-07:00",
        "user": "alex.simonian@gmail.com"
      },
      {
        "content": "I have a computer science degree, and this article does a fantastic job (better than some of the professors I had) of explaining the general concepts that I learned in college:\n\n40 Key Computer Science Concepts Explained In Layman’s Terms\nhttp://carlcheo.com/compsci\n",
        "date": "2017-04-10T20:03:57-07:00",
        "user": "cindytwilliams@gmail.com"
      }
    ],
    "id": 23
  },
  {
    "title": "PowerBI + Dax with Ryan Deeds",
    "description": "",
    "date": "2017-02-25T11:39:16-08:00",
    "user": "leechanghsin@gmail.com",
    "followups": [
      {
        "content": "I met with Ryan Deeds on Thursday and had a good talk about SQL and how they setup the SQL -> Dax -> SAS + PowerBI data pipeline at work to control different levels of data the user can see in the same dashboard. I use mainly R and Python but PowerBI + Dax was actually really nice. Ryan also gave me some idea on how to run text analysis by sharing his experience in analyzing Trump tweets, in particular how he set up word lists for the tweets to bounce against and run sentiment analysis. PowerBI has also a \"Get data\" button where one can easily download Facebook data and data from several websites' API for quick analysis. Was a very good time and learned a lot from a database expert (I only know basic SQL!)\n\nChang\n",
        "date": "2017-02-25T11:39:16-08:00",
        "user": "leechanghsin@gmail.com"
      }
    ],
    "id": 24
  },
  {
    "title": "Review: Natural Language Processing with Chang and John",
    "description": "",
    "date": "2017-02-28T07:08:47-08:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "I had a fun discussion with Chang Lee about various Natural Language Processing topics.\n\nThe first thing I did was give Chang my copy of Taming Text (https://www.manning.com/books/taming-text). It's a quick read and really helped to fill me in on a great variety of the NLP methods that exists (especially those near to search technology).\n\n(https://lh3.googleusercontent.com/-hQPJzYMPERE/WLWPpx9aMxI/AAAAAAAABJw/_ytueXJtqXMExrQxMuYyvmGxCIxBEi47gCLcB/s1600/Screen%2BShot%2B2017-02-28%2Bat%2B8.56.06%2BAM.png)\n\n\nOn this list of possible things to discuss:\n\n   - Entity extraction. (the Who-What-When-Where mentioned in text)\n   - The text processing that is used with search engines. Bag of words. Coding similarly. TF*IDF\n   - Topic modeling (Latent Semantic Analysis, Alternating Least Squares, Latent Dirichlet Allocation)\n   - Hidden Markov Model\n   - statistically significant strings\n   - clustering (LSA vs carrot2)\n   - document summarization We spent the first several minutes talking about Markov Models of text and then moved on to how *Hidden* Markov Models could be used to perform parts of speech tagging. We then went into how search engines work for about 10 minutes.\n\nThen, for the next hour we did some work to index the SciFi Stack Exchange Posts (https://archive.org/details/stackexchange) into Elasticsearch in order to build a k-Nearest Neighbors tagging algorithm. After an initial stalled attempt we ended up with a tagger that at least seems like a good starting point. See for yourself! (https://gist.github.com/JnBrymn-EB/3c8ef277ea865513f7c87a306ae05092)\n\n---------------------------------------\n\nI look forward to someone else asking me to do this again. Even if I'm driving the conversation I *always *learn something new and interesting. And, as Chang said, I always meet such interesting people.\n\n¢¢\nJohn\n",
        "date": "2017-02-28T07:08:47-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "",
        "date": "2017-03-01T11:32:34-08:00",
        "user": "leechanghsin@gmail.com"
      }
    ],
    "id": 25
  },
  {
    "title": "Math chat with Ryan Carr",
    "description": "",
    "date": "2017-03-07T12:17:04-08:00",
    "user": "leechanghsin@gmail.com",
    "followups": [
      {
        "content": "Had coffee with Ryan at 8th & Roast today and chatted for an hour on mathematics, in particular linear algebra about principal component analysis (PCA) and independent component analysis (ICA). We both reviewed what we know about PCA and I tried to do some high level overview on the linear algebra related to PCA like eigenvalue decomposition. Ryan also showed me his current project on music genre prediction and I learned about how he attacks the problem in Python and how he applies his domain knowledge of the problem. Was a great chat and would do it again!\n\nChang\n",
        "date": "2017-03-07T12:17:04-08:00",
        "user": "leechanghsin@gmail.com"
      },
      {
        "content": "I agree, this was a great chat.  Walking through the linear algebra behind PCA with Chang helped to fill in the gaps and reinforce my current understanding of the subject.  ",
        "date": "2017-03-08T07:36:32-08:00",
        "user": "ryan@noisepuzzle.com"
      }
    ],
    "id": 26
  },
  {
    "title": "Recommendation Systems with John",
    "description": "",
    "date": "2017-03-08T07:54:45-08:00",
    "user": "ryan@noisepuzzle.com",
    "followups": [
      {
        "content": "John and I met yesterday to talk recommendation systems.  He shed light on using spark in production of content based systems.  We brainstormed on previous approaches to the problem of time sensitive documents (within a recommendation system) and had a chance to go over some code, which helped to ground the conversation.  \nOverall great chat! I'm looking forward to a followup after I explore more of elastic search.\n",
        "date": "2017-03-08T07:54:45-08:00",
        "user": "ryan@noisepuzzle.com"
      }
    ],
    "id": 27
  },
  {
    "title": "Review: Test Driven Development Lunch Discussion v2",
    "description": "",
    "date": "2017-03-08T12:02:00-08:00",
    "user": "anthonyfox1988@gmail.com",
    "followups": [
      {
        "content": " We had yet another wonderful lunch discussion involving Test Driven Development with Scott Burns, Chris Graffagnino, Chad Upjohn, Abby Fleming, Dani Adkins, Rainu Ittycheriah, and the one and the only John Berryman. This wasn't a low-level code syntax overview, but a general discussion involving great topics like: \n   - The (sometimes) unseen benefits\n   - Typical workflows\n   - Best practices\n   - When you shouldn't test\n   - and how to think through problems in a TDD way. \n*The (Sometimes) Unseen Benefits*\nTo someone new to testing, be it a project manager, yourself, or a colleague, it can sometimes feel like a waste of time. \"Why can't I just write the code now and be done with it!?\", you may ask. This is not an uncommon sentiment to come across. Certainly, if your boss says don't write tests, then you'll have to do what he/she ultimately wants (I might get that in writing) and move along. Having your codebase tested (at least somewhat) doesn't just indicate that you've thought your code through, it goes a bit deeper than that. If it's a library other people are using, having a good test coverage might give them more confidence in your library. If it's purely an internal app/library/whatever, then having a good test coverage gives you confidence in refactoring later. You rip and yank functions as you please, rewrite them entirely or just delete them and, if you have decent coverage, be pretty darn confident that nothing will blow in production if all the tests are still passing. \n*Typical Workflows*\nDo you write the tests before? After? What does a typical bug fix, or feature request look like? Obviously, we'd all love to be able to follow the Red, Green, Refactor principle. Meaning, it may seem like only rockstar devs are capable of writing a failing test first, the writing the code that makes that test pass, then do the refactor. Well, I'm not a rockstar dev and I think most would agree that all we can give is our best. What can we do if not try to do better? If it's straightforward enough, sure, I'll write the test first. This can usually happen with small bug fixes. If it's a feature, on the other hand, it feels impossible. What I typically do is start coding on what I'm trying to implement and write test placeholders along the way. Very simple to do, just a function and pass statement. Maybe a doc string to tell me a bit more. I'll commit it, but I will not submit that PR to review until those tests have been fleshed out more. \n*Best Practices*\nA unit test should test a unit. That sounds redundant, but I'm basically saying that a unit test should test one thing and one thing only. If I have a function that's long and unwieldy, it will probably be a nightmare to test. By taking that function and extracting smaller, more readable functions, I can test every line with ease. Having TDD in mind when writing code thus can help you write cleaner code. \n*Mocking *\nThere are times when testing is just redundant or unnecessary. For example, I don't advise testing 3rd party libraries. You can test how you're calling them, of course, but testing the internals of 3rd party libraries should be handled by the authors of those libraries. To give a silly (and totally thought-of-on-the-spot) example, let's say I'm writing an app that helps out cashiers. I might have code that looks like below. In this case, groceries is a very nice 3rd party library that has a method that when given an item (bananas, cookies, etc) returns the price. The problem is that I'm not concerned with groceries doing its job. I'm having faith that the author of groceries has done what he needs to do for me. I want to test get_subtotal, but I also want to this test to run completely offline. Mocking (basically just telling a function/class what to do manually) helps me get to what I need to do. Which is testing get_subtotal. \nimport groceries  # 3rd party lib\n\n\ndef get_subtotal(items):\n    total = 0\n    for item in items:\n     # Make API call\n     item = groceries.get(item)\n     total += item.price\n\n  return total\n\nand the tests...\n\nimport unittest\nimport mock\n\nimport get_subtotal\n\nclass SubtotalTestCase(unittest.TestCase):\n    # Setup testcase class.. \n    @mock.patch('get_subtotal', return_value=7)\n    def test_get_subtotal(self):\n     items = ['banana', 'hot dog buns']\n     # Since get_subtotal is mocked, it will only return 7 and do nothing else.\n     result = get_subtotal(items)\n     self.assertEqual(result, 14)\n\n\nThese examples are 100% untested in real life, just basic concepts. Overall, we had a blast. A huge shoutout to John Berryman for everything he did to help out with this and make this meetup possible. If we end up having another discussion on TDD, it will definitely be recorded via google hangouts. I will ultimately turn this into a more fleshed out blog post. We're always here to help, so reach out if you have anything questions, thoughts, concerns, praises, blames, etc. \nA few links that were referenced during our conversation:\nClean Code (https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882/ref=sr_1_3?ie=UTF8&qid\u001489003265&sr=8-3&keywords=test+driven+development)\nTest Driven Development with Django (https://www.amazon.com/Test-Driven-Development-Python-Harry-Percival/dp/1449364829/ref=sr_1_8?ie=UTF8&qid\u001489003265&sr=8-8&keywords=test+driven+development)\n(I will add more as I remember)\n",
        "date": "2017-03-08T12:02:00-08:00",
        "user": "anthonyfox1988@gmail.com"
      },
      {
        "content": "Seems like a great talk!  ",
        "date": "2017-03-08T12:24:58-08:00",
        "user": "daniel.j.aquino@gmail.com"
      },
      {
        "content": "Personally, I agree with you. Keep the two separate. Have you integration tests test the DB side of things, but have your unit tests mock out those db calls (or use the test db that django provides) and focus purely on the logic flow. So I definitely agree with you there. I'd be really interested in hearing other comments and opinions about this as well.  \n",
        "date": "2017-03-08T12:29:22-08:00",
        "user": "anthonyfox1988@gmail.com"
      },
      {
        "content": ">From my experience, I'm actually of the opinion that writing unit tests that mock out db calls are not that useful.  I prefer integration tests with some sort of in-memory SQL DB like H2 (I'm mostly a Java dev).  When testing data access code I'm not only interested in making sure my data access code maps data to objects correctly, but I'm also interested in making sure that the SQL I run returns what I expect.\n\n",
        "date": "2017-03-08T13:16:28-08:00",
        "user": "daniel.j.aquino@gmail.com"
      },
      {
        "content": "Of course the option of using an in-memory version of your datastore isn't always viable but it would be the first strategy I would try when testing data access code and then fall back to mocking so you can at least have tests on transforming the data from your DB into whatever structure you define for your app.\n\n",
        "date": "2017-03-08T13:22:18-08:00",
        "user": "daniel.j.aquino@gmail.com"
      },
      {
        "content": "I do believe in using mocks for isolation when testing business logic.  Typically in my code business logic is separated from data access code which is why I don't find unit tests against data access code valuable and prefer integration tests. I'm thinking I may have misunderstood what you meant by *using unit tests to mock out db calls*.  I would mock out data access code when testing code that contains business logic.\n\n",
        "date": "2017-03-08T13:35:48-08:00",
        "user": "daniel.j.aquino@gmail.com"
      },
      {
        "content": "Hey Daniel, sorry for the confusion. It looks like we're on the same page. If I'm testing business logic that doesn't require data, I will mock the db calls. If I need an integration test I might try the test database instance first, or resort to testing via some other \"staging\" database or something similar. I'm not very familiar with pure db testing so I can't help you there though. :( \n",
        "date": "2017-03-12T15:02:09-07:00",
        "user": "anthonyfox1988@gmail.com"
      },
      {
        "content": "I really appreciate you taking the time to lead the session Wednesday, Anthony! ",
        "date": "2017-03-12T17:11:32-07:00",
        "user": "danirenaeadkins12@gmail.com"
      },
      {
        "content": "This session about TDD was so incredibly helpful for me! As a student (and soon to be graduate!), sometimes I like to see how things work \"in the real world.\" To Anthony and the rest of the group, I appreciate you taking the time to explain TDD at a gentle understandable level. One of biggest things I took away was that sometimes you just need to dive into the code and then go back and test before you create a pull request. I'm looking forward to diving into this topic more in the future!\n\n",
        "date": "2017-03-13T09:07:12-07:00",
        "user": "abbyleighanne@gmail.com"
      }
    ],
    "id": 28
  },
  {
    "title": "Back-End Engineering - Side Projects",
    "description": "",
    "date": "2017-03-30T09:00:54-07:00",
    "user": "upjohnc@gmail.com",
    "followups": [
      {
        "content": "I am wondering if someone would be willing to talk to me about Back-End Engineering.  I have been targeting Data Engineering but have found Back-End Engineering roles to be more prolific on job boards.\n\nAt Smile Direct Club, I worked as a data engineer in Django, postgres, redshift.  So my ask for discussion is three fold.  What kinds of projects should I be doing now as a means to build up my portfolio?  Secondly, what keywords should I bring out on my resume and cover letter.  Lastly, is my experience far off the mark that I don't have a chance?\n\nI am up for coffee, lunch, etc.\n",
        "date": "2017-03-30T09:00:54-07:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "Chad and I are having lunch at Eventbrite today (11:30am) to talk about\nthis. If anyone else is interested and can make it on short notice, we can\naccommodate a couple more. If anyone has any specific questions or needs\ndetails about where Eventbrite is, ask her or PM me on the NashDev Slack\n(I'm @bill on there).\n\n\n- Bill\n\n--\nBill Israel  bill.israel@gmail.com\n901-493-1436\nhttp://billisrael.info/\n\n",
        "date": "2017-03-31T09:25:40-05:00",
        "user": "bill.israel@gmail.com"
      }
    ],
    "id": 29
  },
  {
    "title": "Micro Service discussion with Peter Swan",
    "description": "",
    "date": "2017-03-30T11:28:49-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "Great discussion with Peter about what Micro Services are, what they're not, when they're applicable, and when they're not:\n\nMicro services is an architectural pattern that leads to modular design and the ability to release and scale portions of the code independently of one another. Micro service does not imply that you *have to* have each service on a different server. For instance, an ideal way to get into a micro service architecture is to build your application in a way that is already well modularized and build in such a way where each module has a well defined interface. The interface should allow for communication of data, but not behavior. For instance, you can send across the data associated with a user - but you should not send across a User object with methods that govern the user.\n\nStarting from this pattern, then it's easier to develop, release, and scale pieces of the infrastructure separately. If and functional component starts to become slow, then you can change *anything* about it without affecting any other part of the site, without conferring with other teams, etc. And this is the point where you might choose to take the piece of functionality into its own server, connect it to it's own specialized data store (or maybe just a cache in front of the data store) ... in principle whatever.\n\nI still have reservations in certain circumstances. For instance, let's say you want to find \"all Tickets that belong to the Events that Organizer 2343234 has created\". If you have micro services for Tickets, for Events, for Organizers then answering this question takes the following form: Ask the Events service for all events by Organizer 2343234, then for that list of events ask the Tickets service for the ticket details corresponding to all those events. It's the classic 1+N problem. The solution I guess is to make a single service, the Events service, responsible for answering complex questions like this. Or if you're emphasizing \"micro\" then you have a micro service that answers this one specific question. ... so I'm still confused about this.\n\nThough I still have questions I feel like I know more than when I started. Thanks Peter!\n\n-John\n",
        "date": "2017-03-30T11:28:49-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Really enjoyed the discussion, too, it certainly helped me formalize some of my own thoughts about it and it was a pleasure meeting all of you!\n\nI think I'm getting closer to being able to explain myself on the Tickets, Events, and Organizers question and I think it boils down to this: the data for how tickets, events, and organizers are related to each other *have* to live together for an application like eventbrite to make sense so forcing applications to deal with system/service boundaries between those concepts doesn't make sense.\n\nI'd be very interested in a follow up discussion specific to this example: are there any scalability or maintainability issues we couldn't solve without introducing system/service boundaries?\n\nHere are my reformulated thoughts post discussion:\n \n> Why would I want to break my application up?\n\n   1. Independent development and deployment\n   2. Enforcing boundaries helps keeps dependencies clear and applications maintainable\n   3. Indepedent scalability\n\nThe first 2 goals can be accomplished independently of the 3rd and none of the goals necessarily mandate that code live on separate servers and that communication happen over network boundaries.\n\nOther options for communication between applications doesn't require the infrastructure and fault tolerance that communicating over the network does:\n\n   - function calls - separate your code into a library that your other code can use, write bindings for other languages\n   - system calls - shell out to code you want to call\n\nScalability usually has nothing to do with your *code* and everything to do with it's external interface (e.g. a webserver) and it's infrastructure dependencies (e.g. a database). The more your code is coupled to the specifics of the external interface and the infrastructure, the more difficult it will be to scale regardless of whether it lives in a monolithic application codebase. Are our frameworks responsible for some unnecessary coupling here? Rails certainly is.\n\n\nWhen scalability issues do occur, does solving them necessitate extracting a vertically integrated system that includes a its own web server, isolated codebase, and isolated infrastructure dependencies? Likely not!\n\n\nEven if it's decoupled from its external interface and its infrastructure dependencies, code can still be coupled to other code. This is where modularization and software design come into play. Creating boundaries in your code prepares you for extending those boundaries to a service/system level.\n\n\nWhat is a good boundary for a service/system? ",
        "date": "2017-03-30T12:26:16-07:00",
        "user": "pdswan@gmail.com"
      },
      {
        "content": "> However, most web applications *start* with external services and\n> sub-systems like databases, analytics logging, and email. It is easier to\n> draw system/service boundaries (data, not behavior) around concepts closer\n> to infrastructure than it is to draw system/service boundaries around\n> concepts closer to your domain.\n>\n\nI thought this was a particularly salient point, and very well stated.\nUsually it's the infrastructure things that are easier to break out into\n\"services\" in the beginning (though, often I think task queues for things\nlike email and out-of-band tasks will get you plenty far for a long time),\nwhile domain-related things don't obviously break up into separate services\nuntil the business stops moving with the market/clients and starts to\ncoalesce.\n\nI _really_ like this point, Peter.\n",
        "date": "2017-04-03T09:52:06-05:00",
        "user": "bill.israel@gmail.com"
      },
      {
        "content": "Thanks for your time Peter, John and Anthony! I'll see what I can add, might not be gaining new ground though.\n\nFirst and foremost, (micro)services help to provide isolation from a human perspective and independent deployment/scalability from an infrastructure perspective.\n\nIn all honesty, I'm more worried about the human perspective so that groups of people can most efficiently deliver complicated software on time. ",
        "date": "2017-04-04T11:11:50-07:00",
        "user": "scott.s.burns@gmail.com"
      }
    ],
    "id": 30
  },
  {
    "title": "Post NSS Lunch discussion with Chris and Anthony from Stratasan",
    "description": "",
    "date": "2017-04-04T12:10:08-07:00",
    "user": "alex.simonian@gmail.com",
    "followups": [
      {
        "content": "Chris and Anthony were kind enough of share their thoughts with us of what to do post-NSS for job seekers and career changers.  They shared with us their journey from a prior career to where they got today working at Stratasan.\n\n\n   - *Attending and participating at meetups and hackathons* -- we as a developer community thrive on the sharing ideas and knowledge among each.  Years ago, resources for learning programming were few and far between.  Now we have all these open source tools out there.  No one learns in a vacuum.  There is no one clear developer path. Unless you are a unicorn with wings, most of us need a 'tour guide' or 'mentor' to find the next steps.  Attending meetups and hackathons is a great way to get your presence out in the community, as well as gain practical knowledge in the field.  People like to hire people.  When we had guest speakers come and talk about their companies at NSS, the talks were almost never about what cool new core technologies they are using -- the talks centered around how cool it is to work with these people.\n   - *Examples of work* -- many software developers seem to have a scientific method manner of thinking.  If it can't be seen, it is difficult to believe.  In a similar vein, having examples of work on a website, a portfolio, on GitHub demonstrates to others that not only you can talk this, but you have a deliverable.\n   - *Passion* -- for me, the power of passion is a multitude more powerful that the threat of destitution.  You pick a career based on your aptitudes and interests.  Some people thrive on influencing others, some people are skilled in the caring professions.  I really liked John Holland's theory of career choice -- in my opinion, many developers seem to fit the investigative, artistic, and realistic components.  They like to solve novel problems and work with abstract ideas.\n   - *Marketing* --  backend developers, in particular, have a penchant for fact and no window dressing.  Marketing can be a challenge for people who don't naturally think this way.  But, as we know, you can have the coolest gadget or be the best employee, but how can you sell anything without marketing? Business cards are a cheap investment -- and, honestly, they look pretty sweet, too.  \n",
        "date": "2017-04-04T12:10:08-07:00",
        "user": "alex.simonian@gmail.com"
      },
      {
        "content": "There is not much to add to my compatriot's excellent take-aways. But I will try. *Networking is key to job acquisition.* That term \"networking\" seems off-putting to me personally, but to me it encompasses:\n\n   - *Be Visible* to members of the community to which you belong. Go to    meetings. Help at meetings. Listen to more experienced people and    contribute to the conversation.\n   - *Be Earnest* and honest: be yourself.    - *Own you: *your talents, your weaknesses, and your projects. No one    is perfect (even if it seems they are).\n   - *Continue to grow*. Our passion -- or lack thereof -- is broadcast    by the actions we take. To that end, keep coding and keep asking questions.\n   - *Help others* as you can.\n   I have heard from various sources that networking is especially important \"in Nashville,\" but I disagree. My friends in other communities (granted mostly on the east coast) also have had the most hiring happen as a result of their personal network. I've taken it as a given.\n\nAnthony talked a bit about *specialization* of skills. On one hand, that makes us desirable, but I think he was also saying to retain our focus. Keep coding and try to reach competency, then journeyman-level, in one or a few skills. Focus makes us more marketable and productive. Spreading our efforts dilutes our learning and mastery.\n\nOh -- and learn Git. *Learn it real good*.\n",
        "date": "2017-04-04T13:34:59-07:00",
        "user": "belvedmarks4@gmail.com"
      },
      {
        "content": "Many many thanks to Chris & Anthony! Today's lunch was a refreshing reminder to *keep going*. \nHere's a few takeaways that I had:\n\n   - Keep going to meetups. Even if you introvert, continue to be present. It's okay to smile and nod especially when you feel like imposter syndrome is taking over. Volunteering, sponsoring, or giving a talk is a great way to get your foot in the door. Also, business cards! Brand yourself and be genuine.\n   - Keep coding. Find a tutorial on something you'd like to learn and *push your work up to github*. Feeling stuck? Try Codeacademy or TeamTreehouse. Need a project? Try Code for Nashville, local hackathons, or open source projects.\n   - Find your niche. Keep practicing and be a resource for others.\n\n\n\n\n\n",
        "date": "2017-04-04T15:06:34-07:00",
        "user": "abbyleighanne@gmail.com"
      },
      {
        "content": "This sounds like it was a great discussion.  Thanks for the thorough write ups everyone!\n\nRyan\n\n",
        "date": "2017-04-10T08:58:11-07:00",
        "user": "ryan@noisepuzzle.com"
      },
      {
        "content": "So late to this.. \nhttp://anthonyfox.io/now-what\n\n",
        "date": "2017-04-18T19:00:43-07:00",
        "user": "anthonyfox1988@gmail.com"
      }
    ],
    "id": 31
  },
  {
    "title": "Review: Career Building",
    "description": "",
    "date": "2017-04-04T12:23:32-07:00",
    "user": "upjohnc@gmail.com",
    "followups": [
      {
        "content": "First thing to say is that a Penny U meeting at Cinco de Mayo did not include a dumpster fire.  I assume this correlates highly to successful Penny U gatherings.\n\nSecond, there were two things that I took away in the discussion on the job search.  One is to network.  This is getting out and meeting people, most likely at meet ups.  Being seen and being known has value when it comes time to interview.  Additionally, it was suggested to learn a new library and put together a presentation for a meetup.  The other is to market.  This portion of the discussion revolved around creating projects that you could put on display, be it in github or a blog.\n",
        "date": "2017-04-04T12:23:32-07:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "Two ideas resonated with me:\n\n1. Grow relationships by investing in our community. Volunteer to give a talk, blog about a problem you solved, be a liaison between Nashville/NashDev.\n\n2. If nothing else but a mental exercise, consider yourself a product, ie \"You as a Service.\" Are you creating business value? Are there unserved needs in the community? What is your marketing plan?\n\nI've got plenty of room for improvement here!\n\n\n",
        "date": "2017-04-05T07:34:29-07:00",
        "user": "graffwebdev@gmail.com"
      }
    ],
    "id": 32
  },
  {
    "title": "Data pipeline and workflow management tools",
    "description": "",
    "date": "2017-04-10T09:25:00-07:00",
    "user": "ryan@noisepuzzle.com",
    "followups": [
      {
        "content": "Hey everyone,\n\nI am currently working on a project that is in need of a pipeline/workflow management platform.  I am looking at Luigi and Airflow (and others) but am really open to suggestions/advice.\n\nCurrently, I am running about 12-15 tasks, (5 - 20 min each) with at most three layers of dependancies and the scheduling is getting tricky.  I have been getting by on a cron job but could use a platform that offers flexible scheduling and alerts.\n\nI am really new to task scheduling and interested in learning more about some of the best practices.  Anyone interested in a chat/coffee on this topic?  Thanks!!\n\n",
        "date": "2017-04-10T09:25:00-07:00",
        "user": "ryan@noisepuzzle.com"
      },
      {
        "content": "We use Luigi extensively at Juice Analytics, I'd be happy to help if you\ndecide that is the direction you want to go.\n\nCheers,\nJason\n\n",
        "date": "2017-04-10T11:35:23-05:00",
        "user": "jason@mailthemyers.com"
      },
      {
        "content": "Hey, I'd be interested in tagging along for this one! I'm mucking around near Luigi right now for a new Elasticsearch indexing workflow. You guys find a date and time and let me know.\n\n",
        "date": "2017-04-11T06:13:18-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Next Tuesday works well for me. Both John and I are in Cummins Station and\nhave slow hand coffee across the street. Does that work for you?\n\n\nOn April 11, 2017 at 8:59:24 AM, Ryan Carr (ryan@noisepuzzle.com) wrote:\n\nHow about we shoot for a date next week to leave time for others to chime\nin.  Coffee?  I've got Tuesday <http://airmail.calendar/2017-04-18 12:00:00\nCDT>/Wednesday morning open until 9am <http://airmail.calendar/2017-04-11\n08:00:00 CDT>.\n",
        "date": "2017-04-11T07:04:37-07:00",
        "user": "jason@mailthemyers.com"
      },
      {
        "content": "Jason and John: \nCan I tag along?  \n",
        "date": "2017-04-11T07:07:24-07:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "Fine with me\n\n\n",
        "date": "2017-04-11T08:09:28-07:00",
        "user": "jason@mailthemyers.com"
      },
      {
        "content": "Jason,\n\nIt sounds like a couple of us would be interested in hearing more about\nyour experience with Luigi.  I'd be awesome to get some insight from other\nplatform users as well. (airflow, pinball, aws, ...)\n\nHow about we shoot for a date next week to leave time for others to chime\nin.  Coffee?  I've got Tuesday/Wednesday morning open until 9am.\n\nLooking forward to it!\n\nThanks,\nRyan\n\n\n",
        "date": "2017-04-11T08:59:22-05:00",
        "user": "ryan@noisepuzzle.com"
      },
      {
        "content": "8:30am at Slow Hand Coffee.  Google cal invite to come..\n\n",
        "date": "2017-04-12T17:09:08-05:00",
        "user": "ryan@noisepuzzle.com"
      }
    ],
    "id": 33
  },
  {
    "title": "Review: From Academia to Data Science with Aliya Gifford",
    "description": "",
    "date": "2017-04-14T07:59:38-07:00",
    "user": "stkbailey@gmail.com",
    "followups": [
      {
        "content": "Hey all!\n\nEarlier this week, I met with Aliya Gifford to talk about getting into the \"data science\" field from academia. She had a lot of great insights into the job search process, and some really helpful ones for someone coming out of a PhD. \n   - Start networking and scouting out jobs several months *before *starting to write the dissertation. Once the writing begins, everything else in the universe temporarily fades to nothingness. - Browse through LinkedIn profiles to get a feel for what sorts of    experiences the people in jobs you want have. To do it stealthy, turn on    Incognito mode.    - Don't be afraid to cold-call alumni and others. Even if 1/10    respond, you've made progress.\n   - Get involved in the MeetUps, and don't just be a tourist looking    for a job.\n   - Talk to someone who knows the industry to help translate your PhD work into the right \"language\". Interviewers interested in bottom-lines may not be interested in the fact that you correctly classified a CT image, but they might be impressed by the fact that your algorithm improved performance over existing methods by 70%. - Use new tools in your existing projects when you can (and maybe avoid Matlab). Academics is an excellent playground for learning these things. R, Python and SQL are core languages.\n\nThanks again, Aliya, for your time, and thanks to the rest of you for this platform --\n\nBest,\nStephen Bailey\n",
        "date": "2017-04-14T07:59:38-07:00",
        "user": "stkbailey@gmail.com"
      }
    ],
    "id": 34
  },
  {
    "title": "Bayes Inference",
    "description": "",
    "date": "2017-04-18T04:48:22-07:00",
    "user": "upjohnc@gmail.com",
    "followups": [
      {
        "content": "Does anyone want to try to explain Bayes Inference to me?  I have been working through Bayes for Hackers (http://camdavidsonpilon.github.io/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers/).  Somehow I am not understanding it well enough.  I am hoping to get to a point in which I can apply it which means both know how the mechanics of it work and when it functions well.  I can do a Google Hangout or meetup in person.\n",
        "date": "2017-04-18T04:48:22-07:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "I can probably spend 30 minutes during lunch next week scratching out something interesting for you to think about. Call it \"John's broken guide to Bayesian probability theory.\" Basically I would show how a properly labeled Venn diagram can serve as a good analogy for Bayes's notion of probability. We would write out the Bayes equation:  P(A|B) = P(B|A)*P(A)/P(B) and I would show what all those symbols mean and how they link back to the Venn diagram. We'll be able to answer the age old question \"Is Jason Orendorff wearing a bunny suite given that today is a weekend day?\"\n\nI would like to have others there to make fun of the material inaccuracies of my approach and correct me.\n\nI propose next Wednesday 4/26 at 11:30 at Cinco de Mayo. Are you available Chad?\n\n-John\n\n",
        "date": "2017-04-18T12:28:14-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "I am in.  I look forward to getting another's understanding and perspective on Bayes.\n\n",
        "date": "2017-04-19T06:18:05-07:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "I'd love to sit in.  I studied this in a class and also sat in on Allen Downey's workshop at the Open Data Science Conference last year. I'll need to review my notes to be able to follow the discussion :)\n\n",
        "date": "2017-04-19T07:16:20-07:00",
        "user": "maryvanvalkenburg@gmail.com"
      },
      {
        "content": "",
        "date": "2017-04-19T14:21:22-07:00",
        "user": "leechanghsin@gmail.com"
      },
      {
        "content": "I think John would agree with this statement, all are welcome.  We would\nlike you to join.\n\n",
        "date": "2017-04-19T14:49:10+00:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "",
        "date": "2017-04-19T16:39:40-07:00",
        "user": "leechanghsin@gmail.com"
      },
      {
        "content": "Chang\n\nWe are planning on getting together next Wednesday.  I would love for you\nto join and add to the conversation.\n\n",
        "date": "2017-04-19T21:43:48+00:00",
        "user": "upjohnc@gmail.com"
      },
      {
        "content": "I say we cap this meeting at 6 people, since we're all going to be huddled around me scribbling franticly on notebook paper. So far, we have me, Chad, Chang, Mary, and a super surprise special guest. This means we have room for one more. Who will it be? First come, first serve.\n\nCheers,\nJohn\n\n",
        "date": "2017-04-23T20:02:13-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "I think I'll take that last spot! Definitely want to get a little more knowledgeable about Bayes. ",
        "date": "2017-04-24T07:20:12-07:00",
        "user": "stkbailey@gmail.com"
      },
      {
        "content": "I'll squeeze in for spot number 7. Seven is the new six. Thanks John!\n\n",
        "date": "2017-04-24T08:21:33-07:00",
        "user": "ccummings@eventbrite.com"
      }
    ],
    "id": 35
  },
  {
    "title": "Review of Jason Myers intro to Luigi and airflow.",
    "description": "",
    "date": "2017-04-18T15:22:08-05:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "Luigi (https://pypi.python.org/pypi/luigi) is a Python package that helps\nyou build complex pipelines of tasks. It handles dependency resolution,\nworkflow management, visualization, handling failures, command line\nintegration, and much more. (I'm quoting from that link.)\n\nFor my current understanding, Luigi can best be thought of as something\nclose to a *make* file. Just like in *make*, you have a bunch of tasks that\ndepend upon one another.\n\nSo in a *Makefile*, you might have lines like:\n\ntaskA: taskB taskC\n    some_command\n\ntaskC: taskD\n    some_other_command\n\nIndicating that some taskA depended upon tasksB and taskC, and taskC in\nturn depended upon taskD. The tabbed lines then represent the command you\nrun to fulfill the task. (So for taskA your run some_command.)\n\nIn luigi this is specified in python files. So to represent taskA, the\nanalogous python is:\n\nclass TaskA(luigi.Task):\n    def requires(self):\n     yield TaskB()\n     yield taskC()\n\n    def run(self):\n     some_command()\n\nLuigi it pretty bare-bones, which is bad if you want a really shiny\ninterface, but good if you just want something that is simple and\napproachable and unopinionated. An example of Luigi being bare-bones is\nthat it has no scheduling functionality - it only manages dependencies and\nensures that tasks are not being erroneously run multiple times. To\nschedule workflows, you'll need something external, like cron.\n\nWe also talked about airflow a bit. It's a competing technology to Luigi.\nIt's much more polished and a lot easier to get started with. But it is\nunfortunately a bit opinionated about how pipelines will work. The biggest\nexample that we discussed is that airflow thinks that a pipeline is\ncomposed of \"batches\" and each batch has work that can be done in parallel\n- however the execution of the batches can't be mixed together. This leads\nto a problem with the cluster being underutilized. Take the example below\n(as copied from #python on NashDev slack):\n\n\n\n\nThere are two batches which have several sub-tasks. But the sub tasks have\nwildly varying runtimes. Since each batch has to wait for the the longest\nrunning item to finish before the next batch can be started, there are\nsituations where the cluster should be staying busy but is not. And worse\nyet, there are likely cases where the total runtime of the pipeline takes\nlonger than it really has to. Specific example:\n\n   - assume that taskA is in batch 2 two takes 1 hour and is the longest\n   running task in batch 2\n   - assume that taskA depends on taskB\n   - taskB is in batch 1 and takes 1 minute to run.\n   - taskZ is in batch 1 and takes one hour to run (it's the longest\n   running task)\n\nUnder these circumstances airflow would run the total pipeline in 2 hours,\nbut luigi would take 1 hour and 1 minute.\n\nBefore you write off airflow and go whole hog into luigi, remember that\nluigi is going to take a little more thinking to get started -- at least\nthat's the impression I get. And luigi is missing lots of the nice things\nbuilt into airflow. If airflow has what you need, then maybe you should\nstart there rather than building out the things you need piecemeal.\n\nThanks Jason for the tour. I look forward to learning more.\n\nJohn Berryman\n*Author of Relevant Search\n(https://www.amazon.com/Relevant-Search-applications-Solr-Elasticsearch/dp/161729277X)\n(Manning)*\n*@JnBrymn (http://bit.ly/YFO5Hs)*\n*LinkedIn* (http://linkd.in/YKGnc8)\n",
        "date": "2017-04-18T15:22:08-05:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 36
  },
  {
    "title": "penny.university.mod@gmail.com has shared a calendar with you",
    "description": "",
    "date": "2017-04-18T15:45:17+00:00",
    "user": "penny.university.mod@gmail.com",
    "followups": [
      {
        "content": "Hello Penny University,\n\nWe are writing to let you know that penny.university.mod@gmail.com has  given you access to edit events on the Google Calendar  called \"penny.university.mod@gmail.com\".\n\n\nClick this link  [https://www.google.com/calendar/render?cid=penny.university.mod@gmail.com]  to add the calendar.\n\n- The Google Calendar Team\n",
        "date": "2017-04-18T15:45:17+00:00",
        "user": "penny.university.mod@gmail.com"
      }
    ],
    "id": 37
  },
  {
    "title": "React.js discussion with Scott Burns",
    "description": "",
    "date": "2017-04-20T15:31:09-07:00",
    "user": "alex.simonian@gmail.com",
    "followups": [
      {
        "content": "Amid the multitude of JavaScript frameworks out there, react.js is a library that solves the problem of managing a lot of state and working with several people on a large team. React is essentially a component based library that renders UI. So if this is a website you are building for your local dentist or your favorite Mexican restaurant, then react is probably overkill for your needs. However, if you are trying to build, say, a social network, like Facebook, where you could split the webpage into several logical UI components that assemble together on one page, where state is constantly changing, with let's say, a news feed, a chatting with your contacts box, a post feed, comment areas that branch... and a team is assigned to work on each component... react might be helpful. \nHow is React different than other frameworks out there? React is all written in JavaScript and uses a \"virtual DOM\". You can forget about using a template library like in Angular 1.x or Knockout.js. Instead of manipulating the DOM yourself, React does that all for you in the form of diffs under the hood, optimizing the operations with regard to time and space. These components that render HTML are similar to Angular's directives. These components are written as stateful or stateless classes or functions. The JS class or function has a render method. Inside the render method, you use an XML based JavaScript language called JSX that is basically what is a shorthand for rendering HTML/CSS (you dont *have* to use JSX, but it makes your code cleaner and more concise.) This can be *weird* for some people, because it looks like you are mixing HTML and JavaScript together and violating the separation of concerns. But that is not a bad thing, however, this is another philosophy. Also, React is more lightweight and user-friendly than Angular 1.x's API (at least I have found).\n\nStarting in React can be a pain with the webpack, npm/yarn, babel config. Best part, you don't need to worry about this if you use 'create-react-app' for a boilerplate build to focus on React itself. Also, get to know some ES6 syntax as well, and then you are good to go, assuming you have some foundational HTML and JavaScript knowledge. The original docs are very helpful and accessible. You compose these components into a tree-like structure. You keep your \"state\" as high as it needs to be, and you pass state down as attributes to the components called props (short for properties). Next thing to do? Dive right in. The tic-tac-toe tutorial is a great starting point. ( https://asimonia.github.io/tictactoed/ )\n\nReact forces you to write in a functional reactive programming paradigm. This is nothing new. See this -> http://conal.net/fran/tutorial.htm JavaScript is not a pure functional language, but it borrows elements from it. In the imperative style, bugs can arise from mutating state and functions with side effects. In contrast, with FRP when you call your functions, you know exactly the output you will get based on your arguments. This makes your apps more predictable and easier to think about. The functional language Elm that compiles to JS is a close cousin to problem that React tries to solve, but it lacks the community and ecosystem that React has. That is the tip of the iceberg, however, there are benefits and drawbacks to both paradigms.\n",
        "date": "2017-04-20T15:31:09-07:00",
        "user": "alex.simonian@gmail.com"
      },
      {
        "content": "This is a great write-up! Thanks, Alex! \nThe only thing I'll add are some utilities/fun stuff:\n\n   - Use Redux for a global store of state\n   - Check out AirBnB's for testing\n   - ImmutableJS for collection structures\n   - And check out some tutorials!\n   - reacttraining.com\n   - udemy\n   - facebooks official tic tac toe (listed above)\n   - TeamTreehouse (I hear this is a bit dated, but you'll still learn    stuff)\n   \n",
        "date": "2017-04-25T06:47:49-07:00",
        "user": "anthonyfox1988@gmail.com"
      }
    ],
    "id": 38
  },
  {
    "title": "Penny Weekly",
    "description": "",
    "date": "2017-04-23T20:29:08-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "Greetings Penny Scholars!\n\nWhenever you go out for a Penny Chat, remember to do those *Penny Chat Reviews!*\n\n*\"What's a Penny Chat Review?!\"*\n\nThe Review is a short writeup where chat participants review the topic discussed and the new information that they learned. The Penny Chat Review serves 3 important roles:\n\n1) It gives the participants a time to reflect and digest what they learned. As you write, you learn even more!\n2) It is a way of providing the other participants with feedback; letting them know what you gathered from the discussion. (You can even tell them \"thanks\"!)\n3) Finally, the Penny Chat Review serves to remind the community of the value we continue to provide.\n\n*Wanna see some really great Penny Chat Reviews?*\n\nAnthony Fox has taken the art of the Penny Chat Review to an extreme - he has began blogging about his Penny Chats (http://anthonyfox.io/tags/pennyu/). So not only is he providing the community and himself with the above benefits, but he's also using Penny University to build his own brand! And it's working, his post on Test Driven Development was picked up by the tech blogger syndicate, dev.to - see it here (https://dev.to/wtfox/testing-and-test-driven-development---why).\n\n\nSo now we want to hear from *you! *What did you learn today?\n",
        "date": "2017-04-23T20:29:08-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Thanks for this! It's so true! I can definitely understand why the reviews portion get neglected some, but a trick here's a trick I do - I take notes during the meeting. I just keep a small notebook with me and write down the ideas that resonate with me. I'll date it as well. Later in the week when I get some time... maybe that's actually a couple of weeks later... I'll rewrite those notes in a presentation format. Converting the discussion to a presentation. Which forces me to look things up and refresh my memory. After it starts to click I'll post that on my blog. \nOf course, that's not the main benefit from posting reviews, just something I twist out of it. The true benefit comes from reading about the same topic from multiple people. Essentially hearing it explained multiple different ways. It's everything but a guarantee that you'll come away fully versed in the topic. \n",
        "date": "2017-04-25T06:39:47-07:00",
        "user": "anthonyfox1988@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nThis week Penny University introduces a new featured teacher: *Scott Burns*.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\n*Scott Burns* is a software developer at Stratasan, a Nashville-based healthcare analytics company.  He focuses on building products to help users better understand and use data. He enjoys thinking about APIs, data engineering/visualization and shipping simple software.\n\nScott is available for ~1-2 hours a week during lunch hours and he can teach you a thing or two about \"web+django, SQL, db design, data stuff w/ pandas, react/redux/immutable, git, general programming\".\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\nAs members of Penny University you have access to our teachers! Just look them up in the Teacher Directory (https://docs.google.com/spreadsheets/u/1/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and reach out them in email or in our Slack channel.\n\nAnd whenever you have your Penny Chat, then make sure to post back to Penny University (https://groups.google.com/forum/#!forum/penny-university) so that we can all learn a little from your experience.\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-04-30T14:38:49-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nThis week Penny University introduces a new featured teacher: *Bill Isreal*.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\n*Bill Isreal* is a Senior Software Developer at Eventbrite and mainly works with the backend services code for event organizers. Bill has an interest in helping people learn sound fundamentals, while also being pragmatic and not getting in your own way. Bill is one of the organizers of the Nashville Python Meetup Group (PyNash) and is now the main organizer for PyTenneseee 2018.\n\nBill is signed up to teach \"Basic programming concepts, OOP, web programming, and general Python.\" And Bill is available approximately an hour or two a week, during the workday or in the evening (8:30pm, or later).\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\nAs members of Penny University you have access to our teachers! Just look them up in the Teacher Directory (https://docs.google.com/spreadsheets/u/1/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and reach out them in email or in our Slack channel.\n\nAnd whenever you have your Penny Chat, then make sure to post back to Penny University (https://groups.google.com/forum/#!forum/penny-university) so that we can all learn a little from your experience.\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-05-07T16:15:29-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nThis week Penny University introduces a new featured teacher: *John Berryman*. (Hey... that's me!)\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\n*John Berryman* is a Senior Software Engineer at Eventbrite architecting and building Eventbrite's search and recommendation features. John coauthored a book on search called Relevant Search (You should drop what you're doing now and go buy it https://www.amazon.com/Relevant-Search-applications-Solr-Elasticsearch/dp/161729277X). In general John would rather live an interesting life than a happy life, but currently, fortunately, lives both.\n\nJohn is available a couple hours a week, mornings or lunch, and would love to teach *or learn* about math, data science, search, big data, entrepreneurship, general programming, physics, the nature of existence and the self, and why writing books is probably not for you.\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\nAs members of Penny University you have access to our teachers! Just look them up in the Teacher Directory (https://docs.google.com/spreadsheets/u/1/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and reach out them in email or in our Slack channel.\n\nAnd whenever you have your Penny Chat, then make sure to post back to Penny University (https://groups.google.com/forum/#!forum/penny-university) so that we can all learn a little from your experience.\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-05-14T20:32:59-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nThis week Penny University introduces a new featured teacher: *Simon Willison*\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\n*Simon Willison* is a co-founder of the social conference directory Lanyrd, and Director of Architecture at Eventbrite. Simon is also a co-creator of the Django Web framework (*you read that correctly*). Check it out, Simon's even got his own Wikipedia page. Fancy!\n\nSimon has signed up to teach \"Python, Django, SOA, APIv3, elasticsearch, DB design, social software design, rapid prototyping, redis\" and is available for \"Roughly 1 hour a week\"\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\nAs members of Penny University you have access to our teachers! Just look them up in the Teacher Directory (https://docs.google.com/spreadsheets/u/1/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and reach out them in email or in our Slack channel.\n\nAnd whenever you have your Penny Chat, then make sure to post back to Penny University (https://groups.google.com/forum/#!forum/penny-university) so that we can all learn a little from your experience.\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-05-21T19:36:08-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nThis week Penny University introduces a new featured teacher: *Courey Elliott*\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\n*Courey Elliott* is a Software Engineer at Emma with a love of natural language processing. Courey was one of the key-note speakers at this year's PyTennessee, is a regular personality on NashDev podcast (http://nashdevcast.com/), ... and is a fun person to talk with over lunch.\n\nCourey has signed up to teach \"Domain Driven Design, OOP, micro (raspberrypi or arduino)\" and is available for \"2 hours-ish a week, lunch time or weekends\"\n\n*¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢¢*\n\nAs members of Penny University you have access to our teachers! Just look them up in the Teacher Directory (https://docs.google.com/spreadsheets/u/1/d/1l6FOt7APtf9B6pwWlQ0o9dJ_ThxB_KOdHsa3fEbaEE0/edit?usp=sharing) and reach out them in email or in our Slack channel.\n\nAnd whenever you have your Penny Chat, then make sure to post back to Penny University (https://groups.google.com/forum/#!forum/penny-university) so that we can all learn a little from your experience.\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-06-04T14:12:17-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nThis week we have a special surprise from our friend Tanner Netterville - a new logo.* Here, check it out!*\n\n(https://lh3.googleusercontent.com/-_MgS0lf4EgI/WUbn0m8Bk3I/AAAAAAAABO8/DiLWagKgydkYzL4ysctIe02tVZp5rL_UACLcBGAs/s1600/Screen%2BShot%2B2017-06-18%2Bat%2B3.42.50%2BPM.png)\n\n\nIsn't it great? Tanner made this himself and has given Penny U the ownership and right to use it. Consider the thought that Tanner placed in his work. For one, we keep Abe who is both representative of the penny in *Penny* U and also representative of other wholesome things that hold dear: Honesty, Equality, and Self-Education (others?). But this time, Abe's a lot cooler than our previous logo. Remember this guy:\n\n(https://lh3.googleusercontent.com/-74BtRyjC3Fs/WUbtlLLpAnI/AAAAAAAABPk/lm5F6Khhaq89VA1HcQKwJJZSF16QuGewQCLcBGAs/s1600/Screen%2BShot%2B2017-06-18%2Bat%2B4.15.21%2BPM.png)\n\nBig difference right? We also keep the University font, which is representative that we are Penny *University*. And do you see the brown ring in the background of Tanner's logo? That's a coffee cup stain! This harkens back to the Oxford coffee shops that our culture is based on. How creative!\n\n \nHere are a couple of other variants that you may expect to see in various places in our future.\n\n\n\n(https://lh3.googleusercontent.com/-rCUbbOY8jU0/WUbn4ogjvVI/AAAAAAAABPA/us-mB1CF0GsbOVExpLgh1OSKtudiV0BNgCLcBGAs/s1600/Screen%2BShot%2B2017-06-18%2Bat%2B3.43.01%2BPM.png)\n\n(https://lh3.googleusercontent.com/-QFWx3X4rk4g/WUbn9qgJk7I/AAAAAAAABPE/LDdVZ-xVNT0dXBE4vxMZMmHGPrfiDhUfgCLcBGAs/s1600/Screen%2BShot%2B2017-06-18%2Bat%2B3.43.09%2BPM.png)\n\n\nAnd I mentioned earlier how cool our new Abe is when compared with our old one - take a look a how cool Abe is with his new shades:\n\n\n(https://lh3.googleusercontent.com/-PUk3XogHHck/WUboDM_jItI/AAAAAAAABPI/rGAKsKwG88wqjrYWsMqrpwna2AYfaFuzQCLcBGAs/s1600/Screen%2BShot%2B2017-06-18%2Bat%2B3.44.26%2BPM.png)\n\n\n\nNice!\n\n\nAnd in case you're wondering, KUNI NI LERNAS is another creation from Tanner. It's Esperanto, not Latin, (*another symbol*) and it means \"Together we Learn\".\n\n\nNext time you see Tanner. Tell him THANK YOU!\n\n\n*Now go out and TEACH and SHARE and LEARN!*\n\n\n\n",
        "date": "2017-06-18T14:57:08-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nAfter Tanner made us a proper logo (see last week's email), it's time to show it off! This July 27th Penny University is excited to host a collaborative meetup with PyNash at Emma Bistro. This event will be a live-action microcosm of what Penny University is all about. Do you have something you want to learn? Do you have something you'd like to share? Tell us by filling out this form right here. (https://docs.google.com/forms/d/e/1FAIpQLSf6IOLx-aa2-yRMCdtTd0E-gj9aSEB6rKcW90y7m_yoiLSZzw/viewform?usp=sf_link) And then come for the show on the 27th. It will be a blast.\n\n(https://lh3.googleusercontent.com/-_MgS0lf4EgI/WUbn0m8Bk3I/AAAAAAAABO8/DiLWagKgydkYzL4ysctIe02tVZp5rL_UACLcBGAs/s1600/Screen%2BShot%2B2017-06-18%2Bat%2B3.42.50%2BPM.png)\n(https://lh3.googleusercontent.com/-_MgS0lf4EgI/WUbn0m8Bk3I/AAAAAAAABO8/DiLWagKgydkYzL4ysctIe02tVZp5rL_UACLcBGAs/s1600/Screen%2BShot%2B2017-06-18%2Bat%2B3.42.50%2BPM.png)\n\n\n*Now go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-06-25T14:56:37-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nThis July 27th Penny University is excited to host a collaborative meetup with PyNash at Emma Bistro. This event will be a live-action microcosm of what Penny University is all about. Do you have something you want to learn? Do you have something you'd like to share? Tell us by filling out this form right here. (https://docs.google.com/forms/d/e/1FAIpQLSf6IOLx-aa2-yRMCdtTd0E-gj9aSEB6rKcW90y7m_yoiLSZzw/viewform?usp=sf_link) Also, help us advertise! Forward this message along to your friends.\n\n(https://lh3.googleusercontent.com/-_MgS0lf4EgI/WUbn0m8Bk3I/AAAAAAAABO8/DiLWagKgydkYzL4ysctIe02tVZp5rL_UACLcBGAs/s1600/Screen%2BShot%2B2017-06-18%2Bat%2B3.42.50%2BPM.png)\n\n*Go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-07-02T08:31:19-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nThis July 27th Penny University is excited to host a collaborative meetup with PyNash at Emma Bistro. This event will be a live-action microcosm of what Penny University is all about. Do you have something you want to learn?\n\nWe're already forming a pretty good speaker lineup:\n\n   - - Ryan Carr - Real data science and data engineering at a Python company.\n   - Justin Hoover - Complexity, Maintainability, Code readability\n   - Eric Appelt - Live code reading (see how someone thinks as they approach a new code base and looks to fix a bug)\n   - Tanner Netterville - Getting started with drone racing\n   - ? others\n\nDo you have something you'd like to share? Tell us by filling out this form right here. (https://docs.google.com/forms/d/e/1FAIpQLSf6IOLx-aa2-yRMCdtTd0E-gj9aSEB6rKcW90y7m_yoiLSZzw/viewform?usp=sf_link) Also, help us advertise! Forward this message along to your friends.\n\n\n(https://lh3.googleusercontent.com/-_MgS0lf4EgI/WUbn0m8Bk3I/AAAAAAAABO8/DiLWagKgydkYzL4ysctIe02tVZp5rL_UACLcBGAs/s1600/Screen%2BShot%2B2017-06-18%2Bat%2B3.42.50%2BPM.png)\n\n\n*Go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-07-10T06:16:25-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Greetings Penny Scholars,\n\nI am excited! This Thursday July 27th Penny University collaborating with PyNash for our first big, giant group meetup at Emma at 6:00. Already we have 55 people signed up to attend, making this one of the most popular PyNash meetups this year.\n\nWe have an exciting agenda for the night:\n\n   - Ryan Carr - Real data science and data engineering at a Python company.\n   - Justin Hoover - Complexity, Maintainability, Code readability\n   - Eric Appelt - Live code reading (see how someone thinks as they approach a new code base and looks to fix a bug)\n   - Stephen Bailey - Penny U review\n   - Quick-fire Q&A\n\nAlso, help us advertise! Forward this message along to your friends.\n\n\n(https://lh3.googleusercontent.com/-_MgS0lf4EgI/WUbn0m8Bk3I/AAAAAAAABO8/DiLWagKgydkYzL4ysctIe02tVZp5rL_UACLcBGAs/s1600/Screen%2BShot%2B2017-06-18%2Bat%2B3.42.50%2BPM.png)\n\n\n*Go out and TEACH and SHARE and LEARN!*\n",
        "date": "2017-07-23T19:33:37-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 39
  },
  {
    "title": "Review: Bayesian Analysis w/ John Berryman and Chris Fonnesbeck",
    "description": "",
    "date": "2017-04-27T13:33:31-07:00",
    "user": "stkbailey@gmail.com",
    "followups": [
      {
        "content": "\n\nHey Penny People --\n\n \nYesterday, several of us met with John Berryman and Chris Fonnesbeck to discuss the basics of Bayesian analysis. We mostly discussed Bayes theorem and its differences from frequentist statistics. Some highlights were:\n\n   - The theorem: Bayes theorem allows you to directly estimate the probability of a hypothesis being true, given a certain set of data.    - Formula: Here's a link to Bayes formula, which John \"derived\" for    us: https://brilliant.org/wiki/bayes-theorem/ - Example: At the bottom of this email, I share an example that we    worked through (basically). It deals with computing the probability    of having a certain disease (D+), given a positive test result (T+), based    on a sample of 1000 people (S).  - The benefits:    - One of the nice benefits of Bayesian analysis is that it can answer    questions in a more natural way than frequentist statistics can, in some    cases. In our example, we can derive (and interpret) the probability that a    person who tests positive will also have the disease. From a frequentist    perspective, we could only discuss this probability in a more general,    distribution-oriented way, e.g. by saying that the chances are about 0.005    that a person has both the disease and tests positive. (Disclaimer: Not    sure I'm actually getting this explanation correct here.).    - Also, Bayesian analysis can sometimes provide computational    advantages; i.e. some models are more easily estimable using Bayes than    other methods.\n   Other resources noted were: \n   - Gelman's Bayesian analysis book: https://www.amazon.com/Bayesian-Analysis-Chapman-Statistical-Science/dp/1439840954\n     - Martin's book (I think): https://www.amazon.com/Bayesian-Analysis-Python-Osvaldo-Martin/dp/1785883801/ref=sr_1_4?s=books&ie=UTF8&qid\u001493302986&sr=1-4&keywords=bayesian+analysis\n  \n  # Computing the probability of having a certain disease (D+), given a positive test result (T+), based on a sample of 1000 people (S)\n# In this data, the test is very sensitive but not specific\n\n# required probabilities\nN(D+) = 5\nN(T+) = 20\nN(D+,T+) = 5 N(S) = 1000\n\n# required probabilities\nP(D+) = N(D+)/N(S) = 5/1000 = .005\nP(T+) = N(T+)/N(S) = 20/1000 = .02\nP(T+|D+) = N(D+,T+)/N(D+) = 5/5 = 1.0\n\n# applying bayes theorem\nP(D+|T+) = P(T+|D+)*P(T+)/P(D+) = 1.0*0.005/0.02 = 0.25\n# So, given a positive test result, there is still only a 0.25 chance of being disease-positive\n\n#double check by calculating it directly\nP(D+|T+) = N(D+,T+)/N(T+) = 5/20 = 0.25\n\n\nThanks, guys for an awesome lunch!\n\nStephen\n",
        "date": "2017-04-27T13:33:31-07:00",
        "user": "stkbailey@gmail.com"
      },
      {
        "content": "My review:\n\nJohn started by explaining the Bayes formula with a rain/raincoat example, and a tweet sentimental analysis example on factoring the probability. IIRC, the questions goes like this:\nIf a product received a tweet containing the sentence \"I hate this\", what is the probability that the customer loves the product? One way is to factor the probability P(LOVE | I hate this) into P(LOVE | I)*P(LOVE | hate)*P(LOVE | this) if the three words (I, hate, this) are independent. Chris then commented that this kind of independence assumptions often works well. \nThen we started throwing questions out. I think I asked about Bayesian hypothesis testing, which Chris says can be computed with the Bayes formula. He went into detail in explaining the difference between frequentist and Bayesian approach, such as the difference between confidence interval (freq.) and credible interval (Bayes), and why the Bayesian view is gaining momentum. One reason was the computational tools that were not available years ago: PyMC, Stan, Edward, etc. He also recommended two books, as Stephen mentioned above. In my opinion, the Gelman book is a hardcore statistic book (but very helpful.) \nI'll close by saying that I'd love to do this again and/or hack with anyone who wants to try Bayes method on a problem. Obligatory :fast-parrot:\n\n\nChang\n\n\n",
        "date": "2017-04-27T15:39:17-07:00",
        "user": "leechanghsin@gmail.com"
      },
      {
        "content": "I agree this was a fun, informational lunch with John and Chris walking us through understanding and applying Bayes. Another book noted for further exploration was Kevin Murphy's (https://www.amazon.com/Machine-Learning-Probabilistic-Perspective-Computation/dp/0262018020).  I really appreciated the combination of theory and practical application.",
        "date": "2017-04-28T05:07:54-07:00",
        "user": "maryvanvalkenburg@gmail.com"
      },
      {
        "content": "Thanks all for coming! It was awesome that we had Chris Fonnesbeck, creator of PyMC the definitive Python Bayesian modeling library present. He was able to take the discussion a lot deeper that I would have been able to by myself.\n\n*In particular I learned several things:*\n\n*Chris's Bigger view of Bayesian Statistics*\n\nBayesian statistics is encompassed in this neat little equation:\n\nP(H|E) = P(E|H)*P(H) / P(E)\n\nWhere P(*) means \"the Probability of *\", H is the Hypothesis, and E is the Evidence. So in total, P(H|E) = P(E|H)*P(H) / P(E) can be read in English as\n\nThe Probability that the Hypothesis is true given the observed Evidence is =\n> *equal=* to (the Probability that you would see this Evidence in a > situation where the Hypothesis was known to be true) *times* (the > Probability that the Hypothesis might ever be true) /divided_by/ (the > Probability that you would ever see this Evidence)\n\n\nBut in my thinking, H and E were simple things: \"Hypothesis: it's raining; Evidence: you're wearing a raincoat\". BUT Chris reminded me that both the Hypothesis and the Evidence can be complex things: Hypothesis: The likelihood of surviving a dose of arsenic of mass A, given > that your body mass is B follows an equation exp(-θ*A/B)\n\nEvidence:  The mass of various mice Bᵢ the dosage mass given to them Aᵢ and > whether or not they died Dᵢ (taken from a medical study... of an evil > scientist)\n\n\nIn this case Bayes equation can be used to back out the value of the unknown parameter θ P(θ|E) = P(E|θ)*P(θ) / P(E)\n\nHere P(θ|E) is actually a probability distribution over all the possible values of θ given the evidence that we've received. And if you gathered more and more evidence, then the distribution get's tighter and tighter, eventually converging upon the true value of the parameter θ.\n\nThat's a lot cooler than my raincoat example :-P\n\n\n*Bayesians and Frequentists think differently:* There has been a longstanding philosophical debate between so-called Bayesian and Frequentist approaches to statistics.\n\nFor Frequentists, if you ask them \"What is the probability that it's raining in Atlanta?\" they will say \"You're stupid. It's either raining or it's not. There is no probability.\" They say this, because they believe the truth of a hypothesis is fixed in place and non-negotiable. You may not know the answer of whether or not it's raining, and it might be worthwhile to do experiments to find the answer to your hypothesis, but the truth is that it is either raining or not raining. There is no in between.\n\nFor Bayesians, \"What is the probability that it's raining in Atlanta?\" is quite a reasonable question because their notion of probability is tied to *belief*. Do you believe that it's raining based upon the evidence? So to a Bayesian, it makes sense to do an experiment and answer based upon the results of the experiment. And a reasonable answer might be \"I believe that there is a 40% chance of rain today in Atlanta.\"\n\nOr... if you want something more pithy, I'll leave you with this XKCD comic:\n\n(https://lh3.googleusercontent.com/-BpCxn0dURtY/WQNMV9qwY6I/AAAAAAAABNw/bNT9xjyhEKMHBlr58vLxJF3nqXx7p4gWgCLcB/s1600/frequentists_vs_bayesians.png)\n\n\n(https://xkcd.com/1132/)\n\n\nCheers - Let's do this again!\n ",
        "date": "2017-04-28T07:11:27-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "I've also been thinking about the manatee problem that Chris worked on. I had a chance to visit Crystal River, FL a year ago (the Manatee Capital of the World), and I only spotted one manatee over one hour of flight. Given that observing manatee is such a rare event, how does one even go about producing an estimate like \"there are 5,000 manatees in Florida\" if one only sees a handful of manatees in each trip? Maybe it's a variant of the German Tank problem? I suppose the manatees are not labeled, so that's a statistical method that I would like to learn more about.\n",
        "date": "2017-04-28T09:47:08-07:00",
        "user": "leechanghsin@gmail.com"
      }
    ],
    "id": 40
  },
  {
    "title": "Announce:  Terraforming / other config mgmt hangout",
    "description": "",
    "date": "2017-05-04T15:07:06-07:00",
    "user": "duane.waddle@gmail.com",
    "followups": [
      {
        "content": "Sorry for short notice, but a handful of us are going to get on Hangouts Friday night (2017-05-05, tomorrow night) and start talking about Terraform, AWS, and likely other configuration management topics as they may come up.  The hangout link is in the Penny U google calendar -- current plan is 20:30 ET.\n\nIf this is relevant to your interests and you have free time for Friday night hackery, feel free to join -- especially if you know more about Terraform than I do :)\n\n--Duane\n",
        "date": "2017-05-04T15:07:06-07:00",
        "user": "duane.waddle@gmail.com"
      },
      {
        "content": "FYI - here's the Penny U calendar item (https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=bTBldDk0MG1uMGs0djVzamgyYTg3MXMwbDggcGVubnkudW5pdmVyc2l0eS5tb2RAbQ&tmsrc=penny.university.mod%40gmail.com). (It's currently experimental, but if all goes well we'll be telling the community more about it soon.)\n",
        "date": "2017-05-05T07:32:54-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 41
  },
  {
    "title": "Image segmentation with Aliya Gifford",
    "description": "",
    "date": "2017-05-08T17:07:05-07:00",
    "user": "leechanghsin@gmail.com",
    "followups": [
      {
        "content": "Today Sam(@sam) and I had the opportunity to learn about image segmentation from Aliya(@aliya). She first gave us an overview on image segmentation and how the problem is connected to supervised learning with examples from medical imaging, then we dived into a particular image data that Sam is working on where he wants to apply convolutional neural network techniques to cubical imaging data in Python. Two particular things I learned are that spatial information combined with domain knowledge can be useful to rule out noises in images, and that the best way to collect data in medical imaging depends on human anatomy and the problem at hand. I also got more ideas to try on the video classification problem.\n\nIt was a great chat where we got to bounce ideas off each other. Thanks Aliya!\n\nChang\n",
        "date": "2017-05-08T17:07:05-07:00",
        "user": "leechanghsin@gmail.com"
      },
      {
        "content": "In addition to Chang's summary, we also got a nice rundown of the state of current clinical practices of image segmentation.  This talk helped me focus my efforts towards the missing pieces in my current endeavors.\n\nGreat talking with both of you!\n\nSam\n",
        "date": "2017-05-08T18:12:41-07:00",
        "user": "sam.remedios@gmail.com"
      }
    ],
    "id": 42
  },
  {
    "title": "Experiment design with Stephen Bailey",
    "description": "",
    "date": "2017-05-15T14:24:43-07:00",
    "user": "leechanghsin@gmail.com",
    "followups": [
      {
        "content": "In my opinion, social science researchers are great people to learn statistics in a practical way from, so I put together a coffee chat with Stephen where he showed me how he set up experiments in educational neuroscience and different ways to make sure the the experiments produce meaningful results.  \nWe discussed this tweet (https://twitter.com/Heinonmatti/status/861260343120625664) on reproducible research. Apparently, not all researchers have enough funding to complete step 1: collect very large dataset. Most of the time one has to work on a limited dataset and rely on common sense/experience/statistical knowledge to convince themselves that they are making ethical data decisions in their research. Knowing that others struggle with this problem is a good makes me feel better because I often feel insecure about the ways I split data into training, validation, and test sets. We also talked a little bit about time-series signals that showed up in neuroscience. Thanks Stephen! \nChang\n\n",
        "date": "2017-05-15T14:24:43-07:00",
        "user": "leechanghsin@gmail.com"
      }
    ],
    "id": 43
  },
  {
    "title": "Authentication in a Vue app",
    "description": "",
    "date": "2017-05-16T14:56:12-07:00",
    "user": "paul@paulrosen.net",
    "followups": [
      {
        "content": "Here's a synopsis of @enlore 's talk:\n\nThere are various ways to implement authentication. We talked about the overall process.\n\nThe basic idea of authenticating a Vue app is to have a token that is passed by the server to the client. The client then uses that token when requesting data. If the client does not have that token, then do not allow some of the vue-router routes to work (there is existing middleware that does this). (To make that more secure, download the app in two pieces: just download the log in and public pages first, then when there is authentication, download the rest of the app.) If the server is on the same domain as the client, then a cookie can be used to store the data. If the server is a different domain, then the cookie needs to be handled separately.\n\nIf using node.js for the server, then Passport might be a good solution for handling auth. Checking the token can be done by hand in the server, too.\n",
        "date": "2017-05-16T14:56:12-07:00",
        "user": "paul@paulrosen.net"
      },
      {
        "content": "Excellent SO post generally on the subject of handling auth in the context of a single page app: http://stackoverflow.com/questions/20963273/spa-best-practices-for-authentication-and-session-management\n\n",
        "date": "2017-05-16T17:57:01-07:00",
        "user": "nick@codefornashville.org"
      },
      {
        "content": "A couple salient takeaways from SO post: HTTPS required. Send a user/password to the server and get a token back. Without an SSL connection, nothing matters you might as well go home. (Still worth a read: \"...Use https for everything or brigands will steal your users' passwords and tokens.\")\n\n",
        "date": "2017-05-16T18:12:52-07:00",
        "user": "nick@codefornashville.org"
      }
    ],
    "id": 44
  },
  {
    "title": "Spectral Graph Theory by Chang",
    "description": "",
    "date": "2017-06-22T20:39:46-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "I love graphs, I've thought about then every since I was in college. I don't mean \"charts and graphs\" like this \n(https://lh3.googleusercontent.com/-W3_i0fze1Dc/WUyBcRJ4M_I/AAAAAAAABQA/QQGzxlPGRBcoM9uz2KHZsBexJDXYZbnmgCLcBGAs/s1600/34837graph-screen.gif)\n\nI mean *graphs* like this\n\n(https://lh3.googleusercontent.com/-XS3Wsy864Bo/WUyB0YEQUVI/AAAAAAAABQE/YhFKkJJgo4kO2Gkb3eWtIDmRjUEiZGDrQCLcBGAs/s1600/Screen%2BShot%2B2017-06-22%2Bat%2B9.49.21%2BPM.png)\n\n\nI want to more about how things are all connected together and in particular I want to know how people in networks are connected together. I've build algorithms to \"infiltrate\" twitter social networks, and I've blogged about how things like Political Power, can be modeled with the mathematics of graphs (http://blog.jnbrymn.com/2014/07/27/eigenvector-centrality/). The study of graphs it call Graph Theory, but after writing that blog post above, I became interested in a very niche topic within Graph Theory known as *Spectral* Graph Theory.\n\nWhen I heard that Chang Lee knew graph theory I was excited to set up a Penny Chat and today was our day. It is impossible to do the subject justice in such a short summary - event the people developing Spectral Graph Theory have trouble describing some of the aspects of the theory - but maybe I can at least whet your appetite.\n\nAs Chang tells me, the central feature of Spectral Graph Theory is the Laplacian matrix and the Laplacian matrix is made up of the Degree matrix *minus* the Adjacency matrix. Consider this simple graph from my blog post\n\n(https://lh3.googleusercontent.com/-0NYu1W7i_BM/WUyIDUwj0QI/AAAAAAAABQU/cHN-LC6AnTQqPbQwjSYaZD15agJJhkAggCLcBGAs/s1600/Screen%2BShot%2B2017-06-22%2Bat%2B10.16.04%2BPM.png)\n\nThis graph has the following Adjacency matrix:\n\n    A B C D E\n\nA   0 1 0 1 0\nB   1 0 1 1 1\nC   0 1 0 0 0\nD   1 1 0 0 1\nE   0 1 0 1 0\n\nHere every row and every column corresponds to a person in the graph. (The letters are their initials, see?) And if there is a 1 it means that the people in the corresponding row and column are connected. If there is a 0 it means those two people are not connected. (Double check me, did I get it right?)\n\nThe next matrix, the Degree matrix, is much simpler. The \"Degree\" of a node in the graph is simply the number of connections it has. For instance Aaron has two connections Bob and Dave - so his degree is 2. Cindy on the other hand only has as degree of 1. The Degree matrix is just this information shoved into the diagonal of a matrix like so:\n\n    A B C D E\n\nA   2 0 0 0 0\nB   0 4 0 0 0\nC   0 0 1 0 0\nD   0 0 0 3 0\nE   0 0 0 0 2\n\nAnd finally, the Laplacian matrix is simply the Degree matrix minus the Adjacency matrix - this guy:\n\n    A B C D E\n\nA   2   -1 0   -1 0\nB  -1 4   -1   -1   -1\nC   0   -1 1 0 0\nD  -1   -1 0 3 1\nE   0   -1 0   -1 2\n\nOK! Now we've assembled the most basic item of interest in Spectral Graph Theory. What can we do with it?! This, I'm afraid, is where I'll have to leave you with hand waving and teasers only. From here, you perform the eigenvalue decomposition (https://en.wikipedia.org/wiki/Eigendecomposition_of_a_matrix) of the matrix which gives you weird new information about the structure and behavior of the graph. It can tell you about how \"clumpy\" the graph it, you can use this information to understand how \"influence\" flows through a network, you can decipher which members of a group of friends are the \"most powerful\" (again, see my blog post (http://blog.jnbrymn.com/2014/07/27/eigenvector-centrality/)). And you can do really unusual and hard-to-understand things to the graph - like examine what the graph looks like *in the frequency domain*. That's kinda like saying \"See this graph? Here's what it sounds like! <insert a chorus of aliens singing>\"\n\nOne particular thing that I would love to do after my chat with Chang is to use Spectral Graph Theory to cluster people in my Twitter \"social infiltrator\" tool. Chang says that you can take the first 2 or 3 eigenvectors from the Laplacian matrix and, plot them, and it serves to clearly cluster the nodes in the graph. I might just try that when I get a chance ;-)\n\nYou can read more about my kinda graphs here on Wikipedia (https://en.wikipedia.org/wiki/Graph_theory).\nOr if you are a particularly brave soul look here to learn about Spectral Graph Theory (https://en.wikipedia.org/wiki/Spectral_graph_theory).\n\nAnd thanks Chang. Have a blast in your new Data Science career.\n",
        "date": "2017-06-22T20:39:46-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "It was great chatting with you John! If anyone is interested in learning this topic, search for \"graph Laplacian\" instead of \"Laplacian\" as the latter will lead you mostly to differential equation stuff. This is a booming field in academia as people are porting the tools in digital signal processing to combinatorial graphs, which might help developing new dimension reduction techniques (though I have not seen a good one yet.) \nBy the way, I'd love to experiment on your twitter bot algorithm later. Thanks for sharing!\n\n- Chang\n",
        "date": "2017-06-23T05:52:08-07:00",
        "user": "leechanghsin@gmail.com"
      },
      {
        "content": "Randomly, my undergrad thesis was on this topic :) Turns out you can use the eigenvalues of the Laplacian matrix of a graph to predict how \"synchronizable\" it will be, in this case in the context of the part of your brain that regulates breathing when you're unconscious (pre-Bötzinger complex).\n\nhttp://meekohi.com/Holroyd06/\n\nBest,\n  Michael\n\n",
        "date": "2017-06-24T07:45:38-07:00",
        "user": "meekohi@gmail.com"
      }
    ],
    "id": 45
  },
  {
    "title": "Setting up Continuous Integration",
    "description": "",
    "date": "2017-06-28T19:15:19-07:00",
    "user": "delaine.wendling@gmail.com",
    "followups": [
      {
        "content": " I recently met with Brandon Bradley for a quick penny chat over lunch. We talked about how to add Continuous Integration (CI) to a software project. Before getting into the details of implementation we talked about a few different CI services. Brandon mentioned Travis CI (which is free to use on open source projects, OS ftw!), CircleCI, and Jenkins. The main difference between these options is that you would need to manage hosting with Jenkins, but not with the others. The idea behind CI is that your CI service of choice would hook up to GitHub (or BitBucket), detect when a pull request comes in, automatically build your project and run any tests, and send an exit code to GitHub that indicates whether the build passed or failed. The success or failure of the build would be visible on the pull request itself. In order to set up CI you would need to create a configuration file in your project. The example Brandon showed me used Travis CI, so the config file was called .travis.yml. Travis CI’s config file seemed straightforward and easy to set up. The config file will tell the CI service a little about your project so it knows what command(s) to run when a pull request is submitted. Once you have created the config file you will need to go to your project’s GitHub repository settings and add a service in the “Integrations & services” section. The instructions on GitHub are intuitive and easy to follow and include setting up an account with your CI service of choice.\n\nVoila! You should have successfully set up CI! This penny chat helped me feel less intimidated by the process of setting up CI on my projects and I plan on giving it a try within the next week. Hopefully I didn’t give any incorrect information in this review. Thanks to Brandon for taking time out of his day to chat! ",
        "date": "2017-06-28T19:15:19-07:00",
        "user": "delaine.wendling@gmail.com"
      },
      {
        "content": "Delaine, you did great at explaining our chat!\n\nThanks for taking the time to listen, and I hope I got you effectively started on how to setup CI.\n\nCheers,\nBrandon Bradley\n\n",
        "date": "2017-07-26T07:17:23-07:00",
        "user": "bradleytastic@gmail.com"
      }
    ],
    "id": 46
  },
  {
    "title": "Tech Talk Tips",
    "description": "",
    "date": "2017-06-28T19:53:59-07:00",
    "user": "delaine.wendling@gmail.com",
    "followups": [
      {
        "content": " Tonight I met with John Berryman to review my primitive outline for an upcoming talk on d3.js (a data visualization library). John has done quite a few tech talks so it was wonderful to get his perspective. Some of the things I gleaned from our conversation, that may be helpful to others who are preparing for talks, are:\n\n\n   - Make sure you think about all possible scenarios and how you would handle them. “What if the Internet goes out?”, “Are you sure all participants will have a computer?”\n   - Think about the why behind every part of the talk. For example, if you are thinking of live coding, ask why this is the best way to get your point across. - If you are thinking of live coding, practice, practice, practice!\n   - Consider your audience and make sure you create a context for that audience. For instance, I am not giving this talk at a d3 conference where one could assume that the attendees already understand the importance of data visualizations. Therefore, it is helpful for me to explain why data and data visualizations are important before diving into how d3 works.\n   - When you can, explain things using relatable metaphors, visuals, and/or gifs before diving into code. Even people who read and write code for a living can tune out or become overwhelmed trying to understand a concept through unfamiliar syntax. - Get clear on the goals of your talk. This is helpful for your audience and your sanity while preparing.\n   - Practice your talk\n   - Make sure you have a penny chat with John before giving your talk, it is REALLY helpful! (Sorry for volunteering you John) At the very least, get an outsider's perspective.  If you have never given a talk before (this will be my first talk) you should consider doing it and reaching out to a fellow Penny U(er?), what do we call ourselves?, to help with any stage of the process. Thanks again to John for the helpful tips, hopefully these tips help you as well! ",
        "date": "2017-06-28T19:53:59-07:00",
        "user": "delaine.wendling@gmail.com"
      },
      {
        "content": "This is the second time I've helped someone work on tech talk recently. This is always a lot of fun :-) If anyone else is interested in working on a tech talk, call on me if you would like some early feedback or help working on an outline.\n\nThanks for the fun conversation, Delaine. Good luck with the talk.\n",
        "date": "2017-06-29T06:09:36-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 47
  },
  {
    "title": "code / project architecture",
    "description": "",
    "date": "2017-07-11T16:08:48-07:00",
    "user": "aliya.gifford@gmail.com",
    "followups": [
      {
        "content": "I have both general and specific questions about code / project architecture.\n\nBackground: I am a lone developer in the Biomedical Informatics department at Vanderbilt Medical, and I'm working on a project to categorize, sort, store and geocode addresses. Specifically, I have to develop a pipeline to pull, categorize, geocode and tag addresses from a database. The (only) problem is: the project is still developing and there are still moving parts, yet I need to deliver something that works but can be modified (hopefully not too painfully) as the project changes.\n\nSpecifically: If possible I'd like to give you (all, anyone interested) a run through of my current work flow and design to get feedback.\n\nGenerally: As I solo developer getting into building more dynamic projects, where can I learn more about architecture?\n\nThanks!\n",
        "date": "2017-07-11T16:08:48-07:00",
        "user": "aliya.gifford@gmail.com"
      },
      {
        "content": "I'd be happy to meet with you sometime, and discuss the little bits of this\nI know and continue to try and understand. I'll be in Nashville this\nThursday if you'd like to grab coffee or lunch and discuss. I'm can also be\na bit more flexible next week on days as well.\n\nCheers,\nJason\n\n",
        "date": "2017-07-11T21:16:08-05:00",
        "user": "jason@mailthemyers.com"
      },
      {
        "content": "Sadly I'm slammed Wednesday and at an event Friday how about next week?\n\n",
        "date": "2017-07-11T22:14:22-05:00",
        "user": "jason@mailthemyers.com"
      },
      {
        "content": "Jason,\n\nThank you, I'd really appreciate meeting with you about this.\nUnfortunately this Thursday is a little tight, but I can be free after\n3:30. Otherwise next week I'm flexible all day Wednesday and Friday, or any\nday after 12:00.\nLet me know when and where works best for you.\n\nThank you again.\nAliya\n\n",
        "date": "2017-07-12T03:11:01+00:00",
        "user": "aliya.gifford@gmail.com"
      },
      {
        "content": "Sorry if I wasn't clear, I meant I'm free next week on Wednesday or Friday\n- July 19 or 21.\n\nIf those don't work, do you have a preferred day?\n\n",
        "date": "2017-07-12T03:18:27+00:00",
        "user": "aliya.gifford@gmail.com"
      },
      {
        "content": "How about 10am Wednesday?\nIs somewhere around Cummins station good? I'm not familiar with Slow Hand\nCoffee, is that a good place to meet? If not, do you have a preferred\nlocation?\n\n",
        "date": "2017-07-12T03:37:39+00:00",
        "user": "aliya.gifford@gmail.com"
      },
      {
        "content": "I'd be interested in getting the scoop after you and Jason meet (I'm in Charlottesville so would need to be hangout/slack or etc). I've been doing a lot of geocoding recently and might have some tips.\n\nIn general, I find the best way of learning more about \"architecture\" is to talk through designs in detail with people who have worked on lots of different projects (or better, projects similar to the one you're working on). Often the stories of designs that went wrong are the most valuable. There are books and resources that go over common patterns and anti-patterns as well, but the back-and-forth of proposing solutions and critiquing them is what I personally find really valuable.\n\nBest,\n  Michael Holroyd\n\n",
        "date": "2017-07-12T08:07:17-07:00",
        "user": "meekohi@gmail.com"
      },
      {
        "content": "FYI Aliya has posted two Penny Chats to discuss her architecture questions. Show up if you're interested!\n\nWednesday morning at 9:30\nhttps://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=dWFqcHFtcWdpZW5jcHNnMXYxcmhpbTZqOGsgcGVubnkudW5pdmVyc2l0eS5tb2RAbQ&tmsrc=penny.university.mod%40gmail.com\n\nFriday morning at 7:30\nhttps://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=Y29ma2trZnYyaGQ4M281bjBlanZzOGI0dDQgcGVubnkudW5pdmVyc2l0eS5tb2RAbQ&tmsrc=penny.university.mod%40gmail.com\n\nBoth are at Slow Hand coffee.\n",
        "date": "2017-07-17T15:51:54-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 48
  },
  {
    "title": "How to Successfully Grow Tomatoes",
    "description": "",
    "date": "2017-07-12T19:37:43-07:00",
    "user": "delaine.wendling@gmail.com",
    "followups": [
      {
        "content": " I had an impromptu chat with Aliya Gifford on Monday about gardening. I confessed to her that I managed to kill my tomato plants (apparently this is difficult to do) and needed some help. \n*SETUP*\n\n\nI have three tomato plants: two cherry tomatoes and one larger tomato plant. They are planted in 5-gallon buckets with holes drilled into them for drainage. I also have cages around each tomato plant.\n\n\nThis setup is a good start so Aliya asked me other questions like, “How much sun do they get? How much do you water them?”, to pinpoint the problem.\n \n*HOW MUCH SUN?*\n\n\nMy plants are placed in full sun all day long. Aliya told me that, in Tennessee, this is too much for the poor babies, especially because they are in buckets. The bucket absorbs heat and can cook the roots if there is no reprieve from the sun. I am from Duluth, MN, where the sun is often absent and much more gentle than here. If you live in a northern climate like MN, tomatoes thrive in full sun all day, this is NOT true in Nashville!\n \nIf you are a Nashvillian, tomatoes should ideally be placed in full sun for half the day (morning or afternoon) not the whole day. If this is not possible, try to transplant them into the ground, where the roots are less vulnerable OR cover the roots with a light-colored cloth to provide some protection.\n\n\n*WATERING *\n\n\nI have been watering my plants twice a day, once in the morning and once at night.  \nWatering at night is not ideal. Nighttime watering can lead to mildew and fungus problems. Yuck. Midday watering isn’t bad per se, but the heat of the day can often evaporate the water, leaving less for your plant. Leaving us with mornings as the best watering time.\n\n\n*YOU WANT TASTIER FRUIT?*\n\n\nWhen the plants are little, you should water them a lot to help with development and maturation. Once the plants start producing fruit you should back off on the watering a bit and make sure you remain consistent. (e.g. Once a day, once every other day). Why you ask? If you water the plants too much while they are producing fruit, you will dilute the fruit (mind blown). Have you ever had a juicy strawberry without flavor? Too much watering! One sign of over-watering, for tomato plants, is when the tomatoes split. This was happening to my tomatoes. With the right amount of water, the plants will produce more sugar and a tastier fruit! \nIf you are interested in getting started with a garden, or improving your current garden, I would definitely talk to Aliya beforehand! I learned so much in a quick 15 minute chat!\n",
        "date": "2017-07-12T19:37:43-07:00",
        "user": "delaine.wendling@gmail.com"
      }
    ],
    "id": 49
  },
  {
    "title": "Functional Programming Q&A",
    "description": "",
    "date": "2017-07-15T12:49:42-05:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "Curious about Functional Programming? Want to get your questions answered?\nThen come to Emma at 4:45 next Tuesday and ask Nashville Functional\nProgramming maven Bryan Hunter whatever you have in mind (here's the Google\nCalendar invite\n(https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=YW03Mm9wZjc2MGlqOXRpOHRudnBhbWFnMDggcGVubnkudW5pdmVyc2l0eS5tb2RAbQ&tmsrc=penny.university.mod%40gmail.com)\n).\n\nAnd if you have time, stay late and join into the Elixir meetup starting at\nEmma at 6:00 (https://www.meetup.com/nash-elixir/).\n\n",
        "date": "2017-07-15T12:49:42-05:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "First, thanks to Bryan Hunter for taking time out of his day to come way down to level 1 to chat about FP!\n\n\nBefore the meeting was started Bryan talked about PAXOS and RAFT, which are two algorithms for \"solving consensus in a network of unreliable processors\" (wikipedia (https://en.wikipedia.org/wiki/Paxos_(computer_science))). It's out of the scope of this post, but I'd encourage you to at least skim through the wiki. It's *very* interesting.\n\n\nThe biggest takeaway that I have from this chat revolves around proper tail-call recursion. Recursion is something that I've always struggled with, regularly feeling like my brain is blowing up when I need to think about it :). Bryan chatted about what Erlang/Elixir does when a function calls itself, which is just a little different than what I'm used to (😬). As I grocked it: Erlang understands when a function is calling itself, and therefore doesn't keep track of the entire stack. In other languages you'd quickly (or not so) get a stack overflow because you'd exceeded the call stack size. In Erlang, a separate process can be spun up to run/perform that function...forever. Because Erlang doesn't care about the previous calls to that function (why would it, it has all the info it needs in the argument(s) being passed in) it can safely and quickly run it continually until the stars burn out, or it finishes. To me this felt a lot like a game update loop, or at least how you could implement one.\n\n\nOther chats were had about how to properly manage state, and the big takeaway that I got from that is \"don't worry about the entire global state of the thing.\" Each actor will worry about itself, and when actors act on each other they can worry about each other, but there's no reason for one actor to know *everything*. This was just part of a chat that I was ancillary to, so I'd be interesting in hearing more/being taught more/being corrected on :)\n\nThis was a really good chat for me, and I'm glad that I was a part of it. There was only one or two little \"ah ha!\" moments for me, but that's the first time those have really happened in regard to FP. I know that with some more time some more of those moments would come along.\n\nThanks again to Bryan for coming out and chatting!\n\nLuke\n\n\n",
        "date": "2017-07-19T07:20:51-07:00",
        "user": "luketlancaster@gmail.com"
      },
      {
        "content": "Had a great time! Thanks for the great conversation.\n\n*",
        "date": "2017-07-19T09:14:58-07:00",
        "user": "bryan.hunter@leanfp.com"
      },
      {
        "content": "Better late than never for my Penny Chat Review for Bryan Hunter's FP discussion. Here are some of the things that I picked up:\n\n*I finally grokked tail recursion*\nI'm actually embarrassed that I didn't get this earlier since it's such a simple idea. Recursion, as you know, is when a function calls itself. The difficult part of recursion in most languages is stack overflow. This happens because with each call to the function you have to keep track of the value of all of its variables for every call, and if you keep going deeper and deeper, you have more and more to keep track of -- until BOOM! Python protects you by just bailing when the recursion depth reaches 1000. But, if the recursive call is the very last statement in the function, then you are using so-called *tail recursion*. In this case, it's not necessary to keep track of the existing scope any more because you won't use it anymore and in this case an infinite stack depth is A-OK. In Python, tail recursion brings no benefit because Python just still bails out after the stack depth reaches 1000. But in other languages, like Elixir, infinite tail recursion is depended upon and is a primary feature of the language.\n\n*Elixir is cool*\nSpeaking of Elixir, Bryan demoed the tail recursion principle above using Elixir and I got to see some of the syntax. Elixir looks slick, definitely work a little hack time next time I'm jonesing to get my FP on. The last functional programming language I approached was Clojure (with this fantastic online book http://www.braveclojure.com/introduction/), but -- and I know this is trite -- I found the syntax and all the parens everywhere distracting and difficult to read. Elixir seems to keep some of the familiar programming syntax for things like defining modules and functions. This helps me to read the code more easily.\n\n*Handling global state*\nI came into the discussion with a weird belief that in functional programming you have one giant state blob that effectively every function has to deal with as an input parameter. (I'm exaggerating my idea a little bit, but this is close to what I had in mind.) Bryan and Nick Lorenson helped me straight a bit. For instance an Elixir program could be used to track the global state of a online game, but you might actually have a separate function (or process) to manage the state for only a small portion of the map, and then within that function, other functions could deal with the sub-state of the characters in that portion of the map. ... I still don't completely grok the situation, but at least I'm closer to reality than where I started.\n\nThanks Guys!\n",
        "date": "2017-07-24T08:58:22-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 50
  },
  {
    "title": "Penny Chat Request: making dumb little apps for iPhone/Apple Watch",
    "description": "",
    "date": "2017-07-19T07:44:57-07:00",
    "user": "luketlancaster@gmail.com",
    "followups": [
      {
        "content": "Here’s a thing I’d like to learn about: making dumb little apps for iPhone/Apple Watch. Nothing crazy, really just one-trick-ponies. For example: I made a site that tells you if you need a jacket (http://luketlancaster.com/jacket) or not. Another one that tells you if you what it “feels like (http://luketlancaster.com/feels-like)” outside. _very_ simple, but I’d love to learn the littlest bit about doing something like that natively. Anyone want to let me buy you a coffee/beer and point me in the right direction?\n",
        "date": "2017-07-19T07:44:57-07:00",
        "user": "luketlancaster@gmail.com"
      }
    ],
    "id": 51
  },
  {
    "title": "Algorithmic Influencer Marketing",
    "description": "",
    "date": "2017-07-19T19:50:11-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "If you’ve been friends with me for very long, you’ve probably heard me reference my mysterious social-network-infiltrator side project. In my recent meeting with Influence Marketing expert and developer, Kara Fulgum, I learn about this new field within Public Relations and try to determine if my social network tool might find good use.\n\nIf you're interested in learning more about my tool and the interesting field of Influence Marketing then check out my blog post:\n\nhttp://blog.jnbrymn.com/2017/07/19/learning-about-influencer-marketing/\n\n(Oh... and the CSS is completely broke... I'll figure that one out later. :P )\n\n",
        "date": "2017-07-19T19:50:11-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 52
  },
  {
    "title": "Any advice on learning UI/UX?",
    "description": "",
    "date": "2017-07-21T12:19:43-07:00",
    "user": "skaggskd88@gmail.com",
    "followups": [
      {
        "content": "Hi!\n\nCan someone help with gaining UI/UX design skills?\n\nI've been interested in improving my interface and experience designing skills, but progress has been slow. Here's what I've been using so far:\n\n   - *Design award-like sites* - Something like http://www.webdesign-inspiration.com gives well designed sites, but I get the feeling they're hard to analyze and learn from without having a good foundation first.\n   - *Design pattern collections* - I stumbled on http://ui-patterns.com/, which seems like a bunch of useful tools and gives good explanations of them, but I haven't read through them all yet.\n   - *Hack Design* - https://hackdesign.org/ has so far been the most resourceful. Signing up (for free) gets you an email every week with a bunch of resources related to one topic (typography, color, layout, ...). I got all the emails they send and have been slowly working through them.\n\nI imagine that what I need to do is just keep finding user experiences and learning from them (why they're done the way they are) and learning the fundamentals like typography and color theory. But I think I also should focus on building things that I can get feedback on. A site like http://www.dailyui.co/ seems like a next good step.\n\nSo I'm wondering:\n\n   - Am I on the right track? Are there other things I should try?\n   - Where/how can I get feedback on layouts and user experience?\n\n",
        "date": "2017-07-21T12:19:43-07:00",
        "user": "skaggskd88@gmail.com"
      },
      {
        "content": "Hi Kenny, great question\n\nI'm one of the organizers from the [Nashville UX meetup](https://www.meetup.com/nashville-ux/) and a UX practitioner and I can say it sounds like you're on the right track!\n\nLearning patterns and analyzing things that others have built is a great way build awareness of experience and interface. Keep pushing forward in that direction and you're well on your way. In addition to the sites you mentioned, I'd recommend reading articles from sources like [A List Apart](http://alistapart.com), [NN/G](https://www.nngroup.com), [Intercom.io](https://blog.intercom.com), [InVision](https://www.invisionapp.com/blog), [Marvel](https://blog.marvelapp.com), and [UXPin](https://www.uxpin.com/studio/blog/) all have incredible blogs that I always find relevant. I'm going to pause here: the rest of my answer is going to be long and probably a bit dense. There's a list of books and some other resources at the bottom.\n\nAs you push further into it, you'll start to notice a widening split between the UX and UI arena. These two areas are distinct (though highly related) disciplines, and I have very different recommendations on how to develop in each. My perspective on this is by far only one of many. You can get a million great answers from an equal number of practitioners. Here's how I approach the field and my own skill development:\n\nUI design is highly visual and makes use of color, detailed typography and meticulous animation in order to create a beautiful and functional interface. Learning visual design principles, color theory, and gaining mastery over pixel-perfect execution are important. Learn to use tools like Illustrator, Sketch, Marvel, Principal and Framer. You'll also want to get a handle on [accessibility guidelines][a11y] (and regulations!) and the various complexities of designing interfaces for various contexts: an interface for the web has different limitations and requirements than a desktop application for Windows. Read up on the Apple [Human Interface Guidelines][hig] and Google's [Material Design][] system. As for practicing the application of UI skills— I personally find it a fun challenge to take an existing pattern, say the list of messages in your Gmail inbox, and apply some constraints on it: Apply the Nike brand colors or find new icons. Round the interface and soften it a bit or make it feel more \"geometric\" – but keep those interface guidelines and best practices in mind.\n\n\nNow for UX: wireframing page layouts is just the tip of the iceberg. Read up on interviewing users and conducting [various types of research][research methods] to test those wireframes. Use a [heuristics][] checklist and perform an UX audit on an app you use (or one you don't). Learn about some of the [common deliverables][deliverables] used in UX work: prototypes, research briefs, user flows, journey maps, personas, etc.\n\nPutting it into practice: try showing a wireframe (even as a pencil sketch) to a [random stranger in a coffee shop](https://pixelrevival.com/coffee-shop-usability-testing/) and see if they can accomplish the task the design should be able to support (but be friendly and gracious if you do this!). Try making storyboards and user flows out of experiences from your daily life.\n\nRegardless of which side you find more interesting, there are no end of resources to help you. Here's a shortlist of resources (I'm always happy to share more, chat at length, or point you in the right direction if you've got a specific interest in any particular topic):\n\n- The [Nashville UX meetup][] group: we have an active Slack community and an engaged attendee group with lots of discussions, design critique, tips, and some hands-on learning of techniques — I can get you an invite\n- the classic book: [The Design of Everyday Things][]\n- Ellen Lupton's [Thinking with Type][]\n- ustwo's [Pixel Perfect Precision Handbook 3][]\n- the [UX for the Masses][] blog\n- The Apple [Human Interface Guidelines][]\n- Intuit's [Harmony design system][]\n- Google's [Material Design][]\n- [uxdesign.cc](http://UXdesign.cc)\n- [Cognitive Lode][] — a great collection of human behavior thought starters\n- [A List Apart](http://alistapart.com)\n- The blogs by [InVision](https://www.invisionapp.com/blog), [Marvel](https://blog.marvelapp.com), [Intercom](https://blog.intercom.com), and [UXPin](https://www.uxpin.com/studio/blog/) (and the UXPin [webinars](https://www.uxpin.com/studio/webinars/))\n- The [Nielsen Norman Group](https://www.nngroup.com)\n- [Design at Facebook](http://facebook.design)\n- [Design at AirBnb](http://airbnb.design)\n\nAnd like I said, I'm always happy to be as much of a resource as possible. And there's a very talented community of UX designers of many stripes, both in Nashville and beyond, and I'm happy to point you in their direction.\n\n---\n[The Design of Everyday Things]: https://www.amazon.com/Design-Everyday-Things-Revised-Expanded/dp/0465050654/ref=pd_sbs_14_1\n[Pixel Perfect Precision Handbook 3]: https://ustwo.com/blog/the-ustwo-pixel-perfect-precision-handbook-3/\n[UX for the masses]: http://www.uxforthemasses.com\n[Deliverables]: https://uxdesign.cc/ux-design-methods-deliverables-657f54ce3c7d\n[Thinking with type]: http://thinkingwithtype.com\n[Material Design]: https://material.io\n[Human Interface Guidelines]: https://developer.apple.com/design/\n[Harmony design system]: http://harmony.intuit.com\n[Cognitive Lode]: http://coglode.com\n[heuristics]: https://blog.optimalworkshop.com/guide-conducting-heuristic-evaluation\n[research methods]: https://blog.optimalworkshop.com/qualitative-research-methods\n[a11y]: http://a11yproject.com\n[nashville UX meetup]: https://www.meetup.com/nashville-ux/",
        "date": "2017-07-24T22:34:26-07:00",
        "user": "justin.threlkeld@gmail.com"
      },
      {
        "content": "Hi Justin, thanks for such a thorough response! I'll start working through the materials you sent :D\n\nI like the idea of working on design exercises on my own and will definitely try it out. But I worry that I wouldn't have much motivation to work on them without some sort of community to compare with. Maybe I'll get a coworker to do them at the same time so we can critique each others. Something like reddit.com/r/dailyprogrammer for design would be ideal.\n\nThank you again for so much info and for offering support. At this point I don't have much of a direction with this other than to learn as much as I can and to get exposure to what's out there, and all the resources you sent will be a great way to go. But when I want to dive deeper into something and don't know where to go I will definitely reach out.\n\n",
        "date": "2017-07-27T09:51:19-07:00",
        "user": "skaggskd88@gmail.com"
      },
      {
        "content": "\n>\n>  I worry that I wouldn't have much motivation to work on them without some > sort of community to compare with. Maybe I'll get a coworker to do them at > the same time so we can critique each others.\n>\n\nYep! I think a lot of people have this feeling when they're investigating a new field of interest. Check out what the \"Data Nerds\" group is doing (#data-nerds-project in slack).  Since we're a band of people interested in learning data science, we've taken on a shared project - the Zillow data science challenge on Kaggle. And just like you're idea, we're all working independently on the project and then coming back together early next month to compare our progress and our techniques.\n\nSo I think your idea is fantastic. Do you have any group that you could co-work with on the exercises and then compare your work? @Justin, do you have any recommendations for Kenny? I bet you know plenty of people that you could introduce Kenny to.\n\n>",
        "date": "2017-07-28T06:52:10-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Community is critical — I don't want to be too self-promotey, but the Nashville UX group has a large, active slack team with several channels that a perfect opportunities to post work and get feedback and advice from UX practitioners all over on the spectrum of experience. Our #working-on channel is usually pretty busy with exactly that kind of conversation. We're still working out details on a self-service signup, but I'm happy to send invites directly.\n\nIf there's a larger interest in the PennyU community, I would also be happy to set up a UX-studygroup or Q&A channel on the penny-university.slack team and see if some of my peers would be interested in joining me there.\n\nAnd Kenny (and anyone!) — I am absolutely willing to make any direct introductions I can. Feel free to reach out to me directly, or even send me some of your work or questions and I can provide pointers or match-make you with another in the community who has a perspective you might find valuable!\n\n",
        "date": "2017-07-28T08:53:56-07:00",
        "user": "justin.threlkeld@gmail.com"
      }
    ],
    "id": 53
  },
  {
    "title": "Recursion",
    "description": "",
    "date": "2017-08-03T17:46:25-07:00",
    "user": "anadsmith@gmail.com",
    "followups": [
      {
        "content": " *A Question on Recursion*\n\n*Thanks to Duane Waddle, John Still and John Berryman for answering my question!*\n\n After doing some reading in the Functional Programming Q & A penny chat review, I asked in Slack if there was a difference between writing “return some_function()” and “some_function()” in recursion.  i.e. Does using “return” help out in any way… does it break out of the first instance of some_function before working on the second instance of some_function so that our program uses less memory?  For example is…\n\n def game_loop(): # some code here return game_loop()\n\n different from…\n\n def game_loop(): # some code here\n\ngame_loop()\n\n *The Answer*\n\nThe answer to that question is “No”.  In this context, it makes no difference whether you use “return” or not because either way, the first instance of game_loop() will not end until the second instance of game_loop() is evaluated.  i.e. Our “return” will be executed only after what it’s returning is evaluated.\n\n *And much more…*\n\nThe discussion on recursion continued, and I learned much more.  Here is a summary, but if you’d like more details, continue on reading after this section.\n\n *Summary*\n\nSo there's recursion in its various forms.  And one form of recursion is at the end of a function (i.e. tail recursion).  And tail recursion can be more efficient than non-tail-recursion if you're using a programming language that is optimized for it, because (due to memory usage), a computer doesn't have to keep track of the value of prior variables with tail recursion... because at any point in time, the current set of variables the computer is working with is all the computer needs to eventually arrive at the answer.  So tail recursion can be a type of tail call optimization (TCO) with the proper programming language.  However, Python intentionally doesn't support TCO.  So, recursing at the end vs. the middle of your function doesn't matter so much in Python.   So even though recursion in Python (and some other programming languages) requires more memory, recursion is not a bad thing per se.   This is because almost any good recursion function will not require you to recurse very deeply.  In addition, as noted by Duane, Python “allows you to recurse (almost) 1000 levels deep before erroring out by default, and you can increase that number if you need to (and have the memory)”.  However, another thing to keep in mind, is that you may be able to use iteration (ex. loops) instead of recursion.  This could make your code more readable and efficient.  But again, recursion is not a bad thing, and programmers use it commonly enough.\n\n *Additional Details*\n\nBelow are a couple of posts for more detail.\n\n\n*John Still:*\n\nre: tail call in Python. There's a good def'n (and Lisp example) of TCO here: *https://stackoverflow.com/questions/310974/what-is-tail-call-optimization* (https://stackoverflow.com/questions/310974/what-is-tail-call-optimization).  But Python does not and never will implement TCO by fiat of the BDFL (e.g. Guido says no).  There's more info on _that_ here: *https://stackoverflow.com/a/13592002* (https://stackoverflow.com/a/13592002).  If you scroll down a bit in that second link, you'll see that some nutter hacked together a pure Python implementation of TCO; you're welcome to attempt to understand it :slightly_smiling_face:.  The direct answer to your question, however, is \"No.\"  It makes no difference if you `return` or not; in fact, without a `return` statement, TCO is ill-defined (I think, I'm open to being challenged on this if I'm wrong) since it depends heavily on treating the current stack frame as just a conduit for a return value.  But the essential reason why `return foo()` is no more conducive to `foo()` in Python for TCO purposes is that `foo()` will be _evaluated_ before the `return` is _executed_, always.  The `return` can't break you out of the function until `foo()` itself has finished evaluating.\n\n *John Berryman:*\n\nAlright - lemme take a stab at the tail recursion question:\n\nConsider the common toy problem of calculating the fibonacci numbers. The first (0th) and second (1st) in the series is 1, and every subsequent number is equal to the sum of the previous two.\n\nHere are two functions that recursively calculate fibonacci numbers:\n\n *# NOT tail recursive*\n\n def fib(n):\n\n  if n < 2:\n\n  return 1\n\n  prev_1 = fib(n-1)\n\n  prev_2 = fib(n-2)\n\n  return prev_1 + prev_2\n\n  *# tail recursive*\n\n def fib(n, prev_1=None, prev_2=None):\n\n  if n == 0:\n\n  if prev_1 is None or prev_2 is None:\n\n   return 1\n\n  return prev_1 + prev_2\n\n  else:\n\n  new_prev_1 = (prev_2 or 0) + (prev_1 or 1)\n\n  new_prev_2 = prev_1\n\n  return fib(n-1, new_prev_1, new_prev_2)\n\n In both cases `print [fib(0), fib(1), fib(2), fib(3), fib(4), fib(5)]` results in `[1, 1, 2, 3, 5, 8]`\n\nBut the first one calls itself recursively right in the middle of the function and the second calls recursion right at the end.  For the first one (at each level of recursion) it has to keep track of prev_1 and prev_2 so that it can add them up and return them.  So no matter how deep you go in the recursion, when you pop back up a level, there will be data that the program has to keep track of (on the \"stack\").\nIn the second function. It looks more complicated, but everything that it needs to work with is passed in through the arguments, and with each level of recursion, it is no longer necessary to keep track of anything higher in the recursion stack.  So you could, in principle, just throw the variable values like `new_prev_1` and `new_prev_2` away. ... Python however doesn't make this optimization, and the deeper you go the more data you keep track of _just in case_ you'll need it again when you pop back up ... which you won't if you use tail recursion.\n",
        "date": "2017-08-03T17:46:25-07:00",
        "user": "anadsmith@gmail.com"
      }
    ],
    "id": 54
  },
  {
    "title": "Machine learning walk through",
    "description": "",
    "date": "2017-08-04T17:50:52-07:00",
    "user": "beck@eventbrite.com",
    "followups": [
      {
        "content": "Met with Ryan Carr to watch how he walked through a machine learning problem. I have been wanting to participate in Kaggle competitions but kept getting overwhelmed by transforming/sanitizing the data, eliminating noise and feature extraction. \nWe looked at a classification problem of detecting whether an ip address was a bot using the features number of pages viewed over and number of ajax hits over a session. He mentioned the importance of having a virtual environment  with a requirements file that you can copy over to new projects as most ML projects have the same basic requirements (pandas, numpy, matplotlib,scikitlearn,json, jupyter).\n\nHe then opened a new jupyter notebook and we explored the data using Pandas. Pandas has a number of methods that allow you to graph features, extract a uniform sample of the data, append new columns to the data (square existing cols etc) and other useful data transformation methods. >From graphing a small uniform sample of the data in a scatterplot Ryan decided linear models would be best to explore first.\n\nNext, we used a small sample of the data to train and test two models to compare the accuracy. Ryan stated the importance of making sure your training data sample is representative of the population or at least keep it in mind when evaluating the accuracy of a model. We split of data into training and test sets consisting of features and labels. First we used a support vector machine model from scikitlearn and fitted our model using the training data. We then used the test data to predict if the each ip address in the set was a bot or not. The accuracy was around 82%. We also trained a random forest tree model from scikitlearn using the same data and its accuracy was higher. Ryan warned not to trust this accuracy by itself and to look at the precision and recall of the predictions. Another way to test that the model hasn't suffered from overfitting is to run different sample data through the trained model and test the accuracy score, precision and recall. This is known as bagging and scikitlearn has ensemble classes that handle this. It is best to include a number of data points that had been in previous sample data.\n\nI plan to rope Ryan into another penny chat soon to see how he handles feature extraction.\n\n",
        "date": "2017-08-04T17:50:52-07:00",
        "user": "beck@eventbrite.com"
      }
    ],
    "id": 55
  },
  {
    "title": "Community Building Slack Bot discussion with Justin Threlkeld",
    "description": "",
    "date": "2017-08-07T07:42:09-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "Last week I had a very interesting discussion/brainstorm with Justin Threlkeld about building something like a community curating slack bot. For Justin, this would be a platform for building a sort of human-powered knowledge search engine. But for me, similar ideas could be used to help monitor and grow the Penny U communities.\n\nHere are some highlights for things the bot could do:\n\n   - It could catalog the content of public channels and start to build a knowledge base of who knows what ideas and of what ideas are interrelated.\n   - It could help onboard PennyU members - asking them their interests, and directing them towards similar people.\n   - It could hang out in the channel and watch for questions that go unanswered for too long and then connect the person with the question to people that might have an answer.\n   - If an in-slack discussion goes on for too long then the bot can nudge the people towards the In-Real-Life meet-ups that we're trying to garner.\n   - It could reengage people that have been quiet for \"too long\".\n\nA *really cool* idea that came up was the fact that the Slack bot need not live only in Penny University. It can simultaneously live in other interesting slack teams. This could be useful for pulling people in from outside communities if the talent we need lies elsewhere. It's a recruitment bot!\n\nBut all this begs the huge question - how can we get all of the above benefits and *not* be annoying? We would have to build into the bot certain safeguards to not over engage with people.\n\nBuilding a prototype seems like it wouldn't be all that hard - it's a search problem and I happen to be a search dude! Does anyone want to help?\n\nThanks Justin for the conversation and the neat new ideas for me to consider. What am I missing here? I think you also had some neat ideas that I'm just barely skimming over here.\n",
        "date": "2017-08-07T07:42:09-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 56
  },
  {
    "title": "Any neo4j / cypher experts?",
    "description": "",
    "date": "2017-08-08T11:42:41-07:00",
    "user": "cmeador@gmail.com",
    "followups": [
      {
        "content": "I would like to get some help writing path queries to explore this graph I've created in neo4j.\n\nBriefly, I've taken a lot of data from our content management system including items that have been published, modified, and republished over the years (so there is a lineage tree between item publications) as well as editorial comments linked to the users who made them, the items they are referencing, and chronological sequence relationships.\n\nI'd like to explore this graph and look for interesting items, like which items have the most conversations about them, which items have a lot of back-and-forth commenting, which items have the most people commenting on them, etc.  Unfortunately my cypher-fu is pretty weak and I'd love to sit down with someone who has more experience using it and can help me avoid pitfalls.\n\nIt's a big graph with about 1.5M nodes and 3M relationships so the paths can get unwieldy if I'm not careful.\n",
        "date": "2017-08-08T11:42:41-07:00",
        "user": "cmeador@gmail.com"
      }
    ],
    "id": 57
  },
  {
    "title": "DataNerds August Meetup Review",
    "description": "",
    "date": "2017-08-09T20:02:44-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "Tuesday morning of this week we had our monthly \"DataNerds\" meetup. To be honest I was a little nervous going into this one because *I didn't do my homework!* You see we're all individually trying to tackle Zillow’s Home Value Prediction (https://www.kaggle.com/c/zillow-prize-1) challenge, and for this meeting we were all supposed to demo how far we've gotten.\n\nI was relieved to find the many of us (well... all of us) hadn't really done our homework yet. Fortunately one brave soul Stephen Bailey, had stepped up to the challenge - and borrowed someone else's work :-P But in this case it was *great* to borrow someone else's work because it helped us actually get started! As a group, we all screen shared and Stephen walked us through the work.\n\nHere's what we were looking at: https://www.kaggle.com/sudalairajkumar/simple-exploration-notebook-zillow-prize . This isn't a walk though of someone else's solution, but rather it is a walkthrough of the data itself. You can see how the author used Jupyter Notebook and Pandas to see what data was in the set. This consisted of home listings, sale prices, and lots of metadata about the homes such as number of square feet, location, number of bathrooms, etc. etc. (Go ahead and take a look at that link - lots of pretty charts and graphs *along with* the code used to produce them!)\n\nThe neat part of Stephen's guided tour was that it gave us a starting point and made the work more concrete and tangible. We were able to run the cells in the Jupyter Notebook, and occasionally we stopped to ask Stephen questions about the data and Stephen used his Pandas kung-ku to deliver an answer.\n\nAs we left the meeting we had a better idea of the challenge we were up against. Here are the current steps for delivering on the Zillow’s Home Value Prediction (https://www.kaggle.com/c/zillow-prize-1) challenge:\n\n   1. Review the data. Figure out what's there, how much of it there is, the sub-groups, the missing data, etc. Ask questions about the data. Start forming hypotheses.\n   2. Find a set of features that we will use to train a model for predicting house prices. The features is essentially a cleaned-up, well-prepared subset of the raw data.\n   3. Build the model, train it, evaluate the model performance.\n   4. Ship the results back to Kaggle\n   5. Collect the $1.2MM prize.\n\nAre you interested in joining us? If so, there's plenty of time to catch up. Click on the links above for more information and then contact me or Chris Cummings and we'll put you on the calendar invite for next month's meetup.\n\n(Thanks Stephen!)\n",
        "date": "2017-08-09T20:02:44-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Oh yeah... at the meetup I also mentioned a great book for learning Pandas. Here it is. (https://www.amazon.com/Python-Data-Analysis-Wrangling-IPython/dp/1491957662/ref=as_li_ss_tl?ie=UTF8&qid=1488499262&sr=8-2&keywords=python+data+analysis&linkCode=sl1&tag=chrisalbon-20&linkId=3e3c7b466daeda9228770c5919d4d3ae)\n\n",
        "date": "2017-08-09T20:03:51-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Please make me a DataNerd! I have more flexibility during the day soon, and would love to join.",
        "date": "2017-08-12T06:48:22-07:00",
        "user": "maryvanvalkenburg@gmail.com"
      }
    ],
    "id": 58
  },
  {
    "title": "Unit Testing / Error Handling in Python",
    "description": "",
    "date": "2017-08-22T10:34:32-07:00",
    "user": "stkbailey@gmail.com",
    "followups": [
      {
        "content": "Hey all --\n\nAs someone who mainly leverages Python to solve research questions, I mostly work in Jupyter Notebooks doing linear tasks. However, I'm starting to work on some more complicated projects that require multiple levels of functions, and I'm tired of having to go through the whole program to troubleshoot. \nI know that I should be doing \"unit testing\" and that Exceptions can give me more information on what is going wrong, but I'm not sure how to do this well. Would anyone be willing to walk me through some basic error handling in Python?\n\nThanks!\nStephen Bailey\n",
        "date": "2017-08-22T10:34:32-07:00",
        "user": "stkbailey@gmail.com"
      },
      {
        "content": "Thanks all -- had a couple of folks offer to help already. Will post what I learn next week.\n\n",
        "date": "2017-08-22T11:35:21-07:00",
        "user": "stkbailey@gmail.com"
      }
    ],
    "id": 59
  },
  {
    "title": "Deep Learning applied to Medical Imaging with Sam Remedios",
    "description": "",
    "date": "2017-08-27T20:10:39-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "\n\nThis past Thursday I had a fantastic meeting with Sam Remedios reviewing his learnings from his summer internship with the National Institute of Health. Sam spent the summer applying deep learning techniques to a very specific and challenging image recognition problem - classifying brain scan images according to the technique used the generate them.\n\n\nTake a look at these two brain scans. The technique used on the left colors all the empty spaces in the brain as black, the technique used on the right involves an injection of chemical that causes the same spaces to now look white.\n\n(https://lh3.googleusercontent.com/-H0LvOqo9rm0/WaOAAGi_Q-I/AAAAAAAABTQ/ZwuqvL5F39Qp8qZ0WtyVNB98bvDiEOSXQCLcBGAs/s1600/Screen%2BShot%2B2017-08-27%2Bat%2B9.27.10%2BPM.png) (https://lh3.googleusercontent.com/-FK9ERrRbEwE/WaN_8CCn5lI/AAAAAAAABTM/BvxuLMDWaAMfXjmX1YyUuvIZ9A9Zk5tzwCLcBGAs/s1600/Screen%2BShot%2B2017-08-27%2Bat%2B9.27.33%2BPM.png)\n\nAnd if you or me spent a few minutes looking as samples of these two techniques, we would quickly build our own neural networks (in our head) for classifying the two techniques. But how do you get a computer to do this!?\n\n\nSam first attempted to tackle the problem by directly applying existing architectures to the problem. The first one that he tried was AlexNet (https://en.wikipedia.org/wiki/AlexNet), which is one of the early networks that made Deep Learning so popular. And how did it work when applied to the brain scan problem? Horribly! It score almost no better than random guessing. Next Sam applied one of the more recent Google networks to the problem (which one?), and it performed equally poorly.\n\n\nFortunately Sam was learning more about neural networks and in particular why certain architectural designs match well to certain problem domains. Sam was soon able to create his own architecture for this specific problem and it performed much better - correctly identifying the brain scan techniques 70% of the time. This however was not yet good enough to be useful. So Sam noticed that in the Google network in particular, part of the architecture included an interesting manner of parallel processing of inputs - at each layer, some of the information of the previous layer was passed through heavy processing and some of it was directly passed to the next layer with little to no processing. Thus each layer could simultaneously look at higher-level features of the image \"hey, this looks like part of the skull\", as well as lower-level features \"there is strong edge here between a white and a black area\". Sam included similar data pass through in his own architecture and the model accuracy went from 70% into 98% or 99% accuracy.\n\n\nIn our discussion I learned more about convolutional neural networks (it sounds complicate - it isn't!), and how you can apply neural networks not only to images but also to 3D data sets (the brain scans were 256x256x256 pixel cubes). Finally I learned about the technologies that Sam used during the summer - TensorFlow and Keras. I'd already played with Google's TensorFlow library, but I find it complicated and a little hard to get my head around. Sam introduced me to Keras (https://keras.io/) which is a Python library that layers on top of TensorFlow. With Keras you can think more at an architectural level so that you can get more done more quickly. But if you need to you can also zoom in and build chunks in TensorFlow directly. I definitely look forward to working with Keras in the future.\n\nThanks Sam. I learned a lot!\n",
        "date": "2017-08-27T20:10:39-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "I had a great time meeting with you both too!  You nailed the summary for sure!\n\nI was heavily inspired by Google's Inception Module, (https://arxiv.org/abs/1409.4842) but what pushed me over the edge towards having parallel paths for the signal to pass through was a second paper that used this technique and concatenated the feature tensors, the Pyramid Pooling Module (https://arxiv.org/abs/1612.01105).  This concept, built on top of the infamous ResNet (https://arxiv.org/abs/1512.03385) architecture led to PhiNet, the architecture I came up with this summer.\n\nI highly, highly encourage anyone who's interested in exploring deep learning techniques to dive into Keras (http://keras.io)first for the reasons John mentioned.  It takes away the stress of trying to make the neural network function at all, and allows the programmer to explore model architectures and prototype very quickly.\n\nThanks for coming out John and Kevin! ",
        "date": "2017-08-28T06:50:50-07:00",
        "user": "sam.remedios@gmail.com"
      }
    ],
    "id": 60
  },
  {
    "title": "Blind leading the Blind - Carleton Coggins and I tackle the Zillow Challenge",
    "description": "",
    "date": "2017-08-27T21:16:45-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "As many of you know, the DataNerds group is attempting to tackle the Zillow challenge on Kaggle: https://www.kaggle.com/c/zillow-prize-1 (see #data-nerds-projects if you'd like to join us!). And per Stephen Bailey's advice to help get us started we looked at this fellows deep dive into the data https://www.kaggle.com/sudalairajkumar/simple-exploration-notebook-zillow-prize\n\nThis month the DataNerds are supposed to be digging around in the data and extracting features that can be useful in solving Zillow's challenge. But I'm still behind in my progress and all I wanted to do this week is go through the notebook so that I could completely understand what was hiding in the data set. Fortunately I was able to enlist Carleton Coggins to pair with me as we closely reviewed the link above. Both of us are pretty new to this domain so it felt much like the blind leading the blind - but that is still a better situation than going it completely alone!\n\nHere's what we learned:\n\n   - Some Kaggle challenges are made for beginners. (Like the Titanic challenge https://www.kaggle.com/c/titanic) --- *The Zillow challenge is not for beginners! :P*\n   - For any given Kaggle competition, it's a really good idea to look at the \"Kernels\" for the competition. Each Kernel is basically just a notebook full of other's exploration of the data and their attempts to solve the problem. The link that we are working through is a great example of this.\n   - For this particular data set, the author of the kernel applies a systematic approach to understanding the data.\n   - He opens up all the files, looks at samples of the data to just get    a feel for it.\n   - He takes some steps to get a holistic understanding of the data, in    this case determining what the data types are for each field and what    problems the data has - such as missing data.\n   - Next he finds the correlation between the target variable and each    variable in the training data and pulls out the variables that have the    highest correlation.\n   - For each of the high-correlation variables, he plots plenty of    charts and graphs to visualize how the data is correlated.\n   - His basic conclusion is that there is almost no pattern at all in    the data! (That's what makes this a hard problem.)\n   - In reading through the kernel, Carleton and I got a little better understanding about how Python's Pandas library could be useful in munging and plotting data.\n   - We also made a couple of surprising realizations about this challenge that weren't at first obvious.\n   - The challenge is *not* to predict house prices. Since this is a    Zillow challenge I had my mind fixated on this. But in reality, Zillow has    already made a pretty awesome house price prediction algorithm, so what    they are asking us to do is to identify weaknesses in their current    algorithm. So rather than trying to predict house prices, Zillow has given    us a list of the *error* that their algorithm had in predicting house    prices and we are being asked to predict that error. This seems confusing    and indirect, but if we can predict the error of their current algorithm    then this means that we can help improve the algorithm all the more.\n   - \"log error\" was also confusing. Zillow is interested in minimizing    their \"log error\" defined as *log(ZillowEstimate) -    log(ActualSalePrice)*. But why add in the log bit? Once Carleton and    I started plugging in numbers it became obvious. Let's say that for a    particular home sale the ZillowEstimate was $330K but the ActualSalePrice    was $300K. In this case the error is $30K but the log error is log(330K) -    log(300K) or roughly 0.041. Now let's say that for a particular home sale    the ZillowEstimate was $110K but the ActualSalePrice was $100K. In this    case the error is $10K but the log error is log(110K) - log(100K) which is    *again* 0.041. So by looking at log error, Zillow is trying to    minimize their error *percentage-wise* rather than minimizing the    absolute error. This now makes sense intuitively.\n   All this now gives me some ideas about how I can tackle the Zillow challenge:\n\n   - Attach new data sets - since the data that Zillow is using has almost no correlation with the target variable I think I'll try to join in an external data set. Maybe some free geo or crime data.\n   - The kernel only looked at individual variables in isolation. I wonder if some sort of principle component analysis or something could be applied in order to identify a clearer pattern in the data.\n\nThanks Carleton for helping me think through the kernel and get a little closer to our $1.2M reward!\n",
        "date": "2017-08-27T21:16:45-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 61
  },
  {
    "title": "Poker Talk with a Two-Time World Series of Poker Bracelet Winner",
    "description": "",
    "date": "2017-08-31T06:16:43-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "Cool fact - the Director of Engineering at Eventbrite is a two-time World Series of Poker bracelet winner. I happened to set own with him a couple of weeks back and talk about his poker days. But interestingly the conversation turned into something more like life lessons with the metaphor of poker.\n\nI blogged it here:\nhttp://blog.jnbrymn.com/2017/08/31/poker-talk-with-pat-poels/\n\nEnjoy!\n",
        "date": "2017-08-31T06:16:43-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 62
  },
  {
    "title": "Handling Exceptions and Errors in Python",
    "description": "",
    "date": "2017-09-13T03:35:54-07:00",
    "user": "stkbailey@gmail.com",
    "followups": [
      {
        "content": "Good morning, Penny U-ers,\n\nA  few weeks ago, I had an extremely helpful conversation with John Still about Exception handling in Python, and how to build useful tests for your functions. I was a beginner in this area, and we covered a lot of ground, so I'm going to bullet point some of my major take-aways.\n\nThe `try` function can be followed by three statements: `except`, `else` and `finally`. `Except` is used to put in code that handles certain errors in a particular way; `else` is used to execute code when no errors occured, and which does not need to be protected by the try block; `finally` is used for cleaning up files / workspace *regardless *of whether an error was thrown.\n\nI always thought of the \"try...except\" clause as a way to hide my errors and get my code to run no matter what. John said this is a bad idea :-) That's because if you simply bypass all the errors, no useful error messages \"filter up\" and tell you what specifically is wrong\n\nTo that end, John recommended that I try to explicitly name my anticipated exceptions and handle them individually. So, instead of typing:\nfor x in set_of_values:\n  try:\n  my_function(x)\n  except:\n  pass\n\nI would write:\n```\nfor x in set_of_values:\n   try:\n   my_function(x)\n   except ValueError as exc:\n   raise ValueError('{} is not an integer'.format(x) from exc\n   except SomeOtherErrror as exc:\n    raise SomeThirdErrror('{} the function doesn't work.'.format(x)) from exc\n\n```\n\nIn our discussion of unit testing, I learned that the `assert` statement is at the heart of testing, and there are several libraries (pytest, e.g.) out there that can help run and monitor testing. Furthermore, we discussed how testing is an important, not secondary, part of your code if it's going to be used by anyone else, and you should think creatively about how to write good tests.\n\nFinally, John gave me a couple of really great resources that helped me understand Python's data structure a little more generally.\n\n   - Video: Ned Batchelder - Getting Started Testing (https://www.youtube.com/watch?v=FxSsnHeWQBY)\n   - Video: Ned Batchelder - Facts & Myths about Python (https://www.youtube.com/watch?v=_AEJHKGk9ns)\n   - Book: Fluent Python (http://1.droppdf.com/files/X06AR/fluent-python-2015-.pdf) by Luciano Ramalho\n\n\nThanks, John, for the great chat!\n\n-- *Stephen Bailey*\nVanderbilt University\nCell: 615.925.9322\n",
        "date": "2017-09-13T03:35:54-07:00",
        "user": "stkbailey@gmail.com"
      }
    ],
    "id": 63
  },
  {
    "title": "Find Someone to Steal Your Idea - I Dare You",
    "description": "",
    "date": "2017-09-14T20:44:13-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "A week ago I met with an aspiring entrepreneur who had some interesting ideas regarding a recruitment startup. But during the conversation I got the feeling that he was holding his cards close and I was having a little trouble getting the whole picture. Towards the end of the conversation he confided that he was really vested in his ideas for the startup and that it actually hurt to hear those ideas criticized.\n\nThis got me thinking. I was also once this way - I held my “good ideas” close so they wouldn’t be stolen away. And when people poked at the faults in my ideas… well, it hurt. But over the years I came to realize that this way of thinking is flawed.\n\nhttp://blog.jnbrymn.com/2017/09/14/find-someone-to-steal-your-idea-i-dare-you/\n",
        "date": "2017-09-14T20:44:13-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 64
  },
  {
    "title": "Important programming concepts",
    "description": "",
    "date": "2017-09-27T13:31:09-07:00",
    "user": "rubiks.forever2000@gmail.com",
    "followups": [
      {
        "content": "Hi there everybody,\n\nI'm on a mission to better my coding skills and sharpen the way I solve problems in programming. I have been looking around on the web for video tutorials but no luck. Can you guys give me some suggestions on where to find such vids?\n",
        "date": "2017-09-27T13:31:09-07:00",
        "user": "rubiks.forever2000@gmail.com"
      },
      {
        "content": "Hi Ammar,\n\nI think you'll need to help us pin down what fields of programming you're working or interested in. The way we solve problems is very different depending on \"where\" we're working, such as developing web applications, building machine learning models, working closer to the hardware in embedded systems, etc.\n\nThat being said, I've found Gary Bernhardt's talk on Boundaries changed how I thought about designing interfaces between subsystems spread throughout an application https://www.destroyallsoftware.com/talks/boundaries\n\nAlso, I think some of the important skills related to software development do not involve \"coding\" but revolve more around the ability to break problems down into a logical series of steps, managing complexity, building useful abstractions, the ability to quickly understand how a system works and of course how to debug efficiently. These are all more abstract thinking skills than merely making the computer do things by stringing together enough keywords from a programming language.\n\nScott\n\n",
        "date": "2017-09-28T06:38:17-07:00",
        "user": "scott.s.burns@gmail.com"
      },
      {
        "content": "I know I should've been more precise. My bad. I'm looking for useful algorithms, problem analyzing ways, and other things that make a good programmer that are used in real life.\n\n",
        "date": "2017-09-28T14:26:58-07:00",
        "user": "rubiks.forever2000@gmail.com"
      },
      {
        "content": "I see you're in the Slack team. Why don't you drop us a line there Ammar and we can help narrow down the topic and help you out. (It's easier to have a conversation in Slack.) https://penny-university.slack.com/messages\n\n",
        "date": "2017-10-02T07:18:16-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Actually, I posted this question on slack and they told me to post the question on the penny university group.\n\n",
        "date": "2017-10-02T11:28:06-07:00",
        "user": "rubiks.forever2000@gmail.com"
      },
      {
        "content": "Hi Ammar,\nIf you already write code and want to get better, you might look for videos of conference talks. If you’re trying to figure out how to get started, this article has some good suggestions: https://lifehacker.com/top-10-ways-to-teach-yourself-to-code-1684250889. Regards,\nMary",
        "date": "2017-10-03T05:08:09-07:00",
        "user": "maryvanvalkenburg@gmail.com"
      },
      {
        "content": "\nHi, Ammar- I'd recommend having a look at https://www.edx.org/\nThese are courses taught by universities (including MIT and Harvard) that you can typically take for free.  There's multiple courses that make mention of \"algorithms\".\nAlso, if you're looking at learning a particular language, Edx will work well too but I'd highly recommend Treehouse.com ($25/mo to take as many courses as you can).  Specific learning paths here:  https://teamtreehouse.com/tracks\nThanks,\nD.\n\n",
        "date": "2017-10-04T08:21:43-07:00",
        "user": "anadsmith@gmail.com"
      },
      {
        "content": "Yeah, I actually already take treehouse classes. Thanks a lot for the recommendation.\n\n",
        "date": "2017-10-05T09:34:27-07:00",
        "user": "rubiks.forever2000@gmail.com"
      }
    ],
    "id": 65
  },
  {
    "title": "Learning how Brains Work with Stephen Bailey",
    "description": "",
    "date": "2017-09-29T20:20:37-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "This past week I had lunch with Stephen Bailey and learned about his work with neurology and got a little closer myself to understanding how the Brain works. It was a great conversation, so I blogged! Enjoy ~ http://blog.jnbrymn.com/2017/09/27/brain-scans/\n\nP.S. Penny University has been a fantastic way to get back into blogging! You guys should try to. It's a fantastic way to make a small but indelible mark on the world.\n",
        "date": "2017-09-29T20:20:37-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 66
  },
  {
    "title": "Data Science Perspective w/ Damien Mingle",
    "description": "",
    "date": "2017-10-12T08:19:54-07:00",
    "user": "stkbailey@gmail.com",
    "followups": [
      {
        "content": "Hey Penny U --\n\nOn Tuesday, Several of us in the \"Data Nerds\" meetup got to chat with Damien Mingle, Chief Data Scientist at Intermedix. It was a fantastic hour, and I've written up some of my big take-aways below. \n*Side-note*: Last week I also got to chat with Dr. Jesse Spencer-Smith, Director of Data Science at HCA (https://stkbailey.github.io/data-science/vanderbilt/2017/10/05/Jesse-Spencer-Smith.html). It wasn't a Penny Chat, but I did write up a review on my website (https://stkbailey.github.io/data-science/vanderbilt/2017/10/05/Jesse-Spencer-Smith.html), if you're interested in more Nashville data science perspective.\n\n--- \nDamien told us the story of his career -- how he went from building predictive real estate algorithms to being a scrappy, Excel-using Kaggle competitor to leading a 16+ person data science team at Intermedix that improves health outcomes for hunderds of thousands of patients. \nWe drank knowledge from a fire hose for an hour, but I've jotted down a few of my favorite bits of advice from the discussion. Enjoy!\n\n*#### \"Think creatively - but also carefully - about your features.\"*\nIntermedix has models that assess the probability for a patient to get [*sepsis*](http://www.mayoclinic.org/diseases-conditions/sepsis/symptoms-causes/dxc-20169787), a condition that is hard to predict and can lead to premature death. Damien discussed how his team starts with 6 variables from basic claims data -- billing information -- then combines it with social, epidemiologic, demographic and other variables to create a 2200+ length feature vector for each patient. Their models have gotten up to an AUC of 0.93 or so -- far better than the \"business-as-usual\" performance.\n\nWith 2200 variables, it might seem that the team is throwing in the \"kitchen sink\". But actually, the model does not use any information from a patient's Electronic Medical Record despite having access to it. The idea is that, if pulling out the \"kitchen sink\" requires getting permission from the homeowner, the county, the federal government and the construction of new storage facilities, security protocols, etc., etc. -- the extra bit of accuracy it provides might not be worth it. So deciding what NOT to include can be as important as what to include. \nWhat's in that feature vector? We didn't talk about all of them, but Damien did reveal one: the \"distance from bathroom toilet to bathroom sink\" in your house. Let's just say there could be a relationship between getting a life-threatening disease and whether toilet water splashes on your toothbrush...\n\n*#### \"Flip retrospective questions on their head.\" *\nMost companies have analytics teams that can do a post-mortem on their data: \"How many widgets did we sell in the last 60 days?\" Far fewer people are comfortable with the prospective version: \"How many widgets do we expect to sell in the next 60 days?\" This is a cozy and fruitful space for data scientists to live in.\n\n\n*#### \"Predictive models have instincts, too.\"*\nMany people have a lack of appreciation for the \"from the gut\" nature of what a predictive model does. People understand that a doctor might have a \"hunch\" as to what a patient's problem is with only a glance and a small bit of information. When it comes to ML, though, people tend to think there is always a clear, precise reason for a given decision -- although it might be better described as a quantitative instinct. \nSimilarly, data scientists should be prepared to communicate to stakeholders that some features -- even hot new ideas -- might not be useful for the model, despite the fact that Time magazine just published an article about it.\n\n*#### \"Believe more in what you think you can do than what you can do.\" *\nIn short, be confident in yourself! Analytical folks are often hesitant to be wrong in front of peers. Especially in team settings, where it's about getting results and not inflating egos -- I'm looking at you, academia -- putting out a \"dumb\" idea might spur a productive conversation that wouldn't otherwise have happened. When you hold your ideas back, the team and product suffers. \n*#### \"We can't all be Supergirl.\" *\nReferencing the hit CW show all data scientists *must* watch, Damien concluded with reassuring advice: it's okay to not know everything. Even though the executives pushing for the new data science division want you to have laser vision, super strength, super speed, invulnerability and a tight leotard -- it is sometimes enough to be there, solving business problems and mining whatever value you can with the existing systems and your particular strengths.  \n---\n\nThanks a lot, Damien, for the great chat -- and John for organizing, despite being on the verge of second-fatherhood. \nData Nerds meets the second Tuesday of each month at Eventbrite. Find out more on the Slack channel #data. \n\nStephen Bailey\n\n",
        "date": "2017-10-12T08:19:54-07:00",
        "user": "stkbailey@gmail.com"
      }
    ],
    "id": 67
  },
  {
    "title": "Web Analytics with Rob Harrigan",
    "description": "",
    "date": "2017-10-24T17:17:31-07:00",
    "user": "leechanghsin@gmail.com",
    "followups": [
      {
        "content": "\n\nRob (@rharrigan on Slack) is the one man data team at 247sports, a CBS Sports affiliate, and one of his job is web analytics for the site. I am also working on clickstream data now, so I hit him with questions to know how people practice web analytics outside of my team. \n \nFor example, we talked about how they capture data and track users from different sources like Facebook and Google, and what do they do with the data. \n \nOne of my problems was how to remove bot-generated traffic from web data. He told me that I can tell from the user agent. (I'll need some clarification later, as the data I'm working with doesn't have a meaningful field for the user agent.) Another was how to identify unique views/users. He said that the industry is pushing toward counting the number of sessions instead of counting views, and building user profile from data other than cookies and GUID is still difficult.\n\n \nThey process data with Splunk and store on AWS. I don't have any experience with AWS, but he also gave me some cool articles, like how to capture page scrolls with Amazon Kinesis:\n\nhttp://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/kinesis-examples-capturing-page-scrolling.html\n\n \nWe chatted for only about 30 minutes on Hangout, but I learned a lot about how people do web analytics -- something I never learned in school! Thanks Rob!\n\n \nChang\n",
        "date": "2017-10-24T17:17:31-07:00",
        "user": "leechanghsin@gmail.com"
      }
    ],
    "id": 68
  },
  {
    "title": "Django Walkthrough",
    "description": "",
    "date": "2017-11-03T04:37:15-07:00",
    "user": "stkbailey@gmail.com",
    "followups": [
      {
        "content": "Hey all --\n\nI am interested in learning a bit more about Django and how it's structured. I have done a little bit of learning about the basics but still don't quite have a grasp of the big picture. Specifically, I'm working on a project in which we're making a web app out of some tools I created, and I'd love to be able to contribute to its development. So, if anyone would be able to come alongside me and help me make sense of the architecture for this project specifically (I think it's a pretty basic Django build), I would love to buy you lunch or coffee.\n\nThanks a lot!\nStephen Bailey\n",
        "date": "2017-11-03T04:37:15-07:00",
        "user": "stkbailey@gmail.com"
      },
      {
        "content": "Stephen -\nI’m in to help if no one else has claimed it. Just let me know when you’d like to meet and we’ll get it on the calendar!\n\n- Bill\n\nSent from my phone\n\n> ",
        "date": "2017-11-03T08:06:20-05:00",
        "user": "bill.israel@gmail.com"
      },
      {
        "content": "Thanks, Bill! Stephen Bailey\n\n> ",
        "date": "2017-11-03T08:53:51-05:00",
        "user": "stkbailey@gmail.com"
      }
    ],
    "id": 69
  },
  {
    "title": "Re: Data Science Discussions",
    "description": "",
    "date": "2017-11-09T19:54:34-08:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "This past week, in my quest to better understand the field of Data Science, I got a chance to meet with another couple of really interesting people, Jason King, and Jimmy Whitaker. Here's what we covered:\n\n*Jason King - Xsolis*\nXsolis helps to inform hospitals of any risk that their medical treatments and procedures may not be reimbursed by insurance companies. They do this by processing medical data and building machine learning models that classify the output as either reimbursable or not. Jason works as a Data Scientist as Xsolis. According to Jason, Xsolis process a very large and diverse set of data for their hospitals in order to build these models. The model, then is actually a \"stacked model\" (https://en.wikipedia.org/wiki/Ensemble_learning#Stacking), a layered combination of several low-level models into one overarching model. Jason's piece of the puzzle is in handling textual feature extraction and modeling. The text comes from various sources - hand-written prescription, doctor's voice recorded noted, etc. Because of the wide variety of the inputs and the particularly \"dirty\" nature of the inputs, Jason says that he probably puts 75% of his time into data cleanup.\n\nAnother interested part of our discussion is Jason's background. Jason got a PhD in biology/physics related to protein folding - something very different from Data Science. Jason transitioned to Data Science by teaching himself the trade. He says that he spent probaby 2 hours a night for 6 months learning about the techniques and theory behind Data Science. \nKaggle was another interesting topic we covered. Jason has been involved in 3 different Kaggle competitions, winning a bronze medal in one of them. I didn't know this, but if you get 2 bronze medals or better, then you will have access to competitions in Kaggle that are only available to elite competitors. That's enticing. Jason say that Kaggle is a great was to practice, learn, and to develop a portfolio of your work, but he warns that you can no longer go to Kaggle and expect to become famous. The early competitors regularly won competitions with very simple techniques, but now Kaggle has drawn in a very large community of very talented data scientists.\n\n*Jimmy Whitaker - Digital Reasoning*\nDigital Reasoning researches and builds products with \"cognitive computing\" - e.g. artificial intelligence. Jimmy is leading a team that is pioneering Deep Learning efforts in Computer Vision, Audio Speech Recognition, and Text analytics. Jimmy is the first Data Scientist that I've met with that is working directly with Deep Learning! And that is a large part of the conversation that we covered - What is Deep Learning? And why is it the next cool thing?\n\nAccording to Jimmy, Deep Learning is basically the same thing as Neural Networks. And Neural Networks, basically, are just a way for a computer to take a bunch of input-output data and build a black box function that can take a new input and predict the appropriate output. So how's this different from \"classical\" data science? This is where things get really interesting. With classical data science a human carefully designs features. So with images, for example, your basic features might be edges, corners, and color gradients. From simple features, you then build more complex features like circle or rectangle detection, and you keep building up more and more complicated features. But there's a problem with this approach. If you're building an algorithm to locate the position of cats in a photograph, then at the end of the day you're going to have to build up very strange and complex \"cat\" features by hand. This starts to feel foolish. What's a cat feature?! Here is where Deep Learning is radically different form \"classical\" data science - you don't worry about the specific features at all! You create a network and let the network build it's own features. In some ways the network as it learns builds features much like a human would - low level features are again edges, corners, and color gradients; upon these are built higher level features. But since the features are based completely on the data, you never have to worry about \"What's a good set of cat features?\" - the network finds a good set automatically.\n\nJimmy's current work is in speech recognition. Unlike Siri or Alexa, which relies upon having a fairly clean input (humans talking slowly so that a computer will understand them) Jimmy is trying to make it possible for computers to transcribe text from much \"dirtier\" real-world input data. Seems like interesting work.\n\nJimmy also has a great story about how he got into Data Science. Jimmy started out with a bachelor's degree in a technical field (I think engineering, but I don't recall the details). After graduating and working the field for a short time Jimmy decided that this was the wrong field and left and become a construction worker. Yep... a construction worker. And soon Jimmy again felt that he'd landed himself in the wrong field, so we enrolled in Oxford University in England studying AI and cyber security. Yep... Oxford. Pretty big leap aye? But now Jimmy appears to have found a field that he enjoys.\n\nThanks Jason and Jimmy! The conversations were incredibly interesting.\n\nJohn\n",
        "date": "2017-11-09T19:54:34-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "This week I've been in Penny Chat overdrive, Tuesday, Wednesday, and Thursday I had lunch with different Data Scientists. In the not-so-distant future I would like to morph my career toward Data Science (and MATH!) so I'm effectively going around and interviewing people that are Data Scientists and learning about how they work.\n\nHere's a quick summary of what I learned this week:\n\n*Sharon Chou - Asurion*\nAsurion provides small item insurance policies. (So if you buy a TV at Walmart, then Asurion might be the company that handles the insurance policy that you buy.) Sharon's work there is in support of Asurion's customer support chat feature. At the end of each support chat the customer can rate their satisfaction with the support. Sharon's work is then to figure out what way to best improve the customers' satisfaction. Factors that come into play are the response times, the time spent with support, the topics they talk about etc.\n\nSharon's previous employment was with a clean-tech startup where she built models that predicted energy and cost savings that would result from making facilities improvements. One of the perennial frustrations there was with a lack of data and with the greatly varied sources for getting data about existing properties and their energy consumption.\n\nSharon's tech stack is python-based: Scikit-learn and friends.\n\n*Damian Mingle - Intermedix*\nDamian the the Chief Data Scientist at Intermedix, coming by way of a company he founded called WPC Healthcare which recently sold to Intermedix. (Did I get that right Damian?)\n\nThe main project that Damian is working with is sepsis prediction. Sepsis is a deadly infection that can be treated if caught in time, but is often recognized too late. Damian and his team are building a model to predict sepsis early so that it can be treated. The problem is challenging because the access to medical records is limited -- and besides, the medical professionals often recognize sepsis to late, it sneaks up! So Damian and his team have figured out a way to join in lots of disjointed data sets, impute missing data, and they have a tree-based approach (IICR) that very accurately predicts sepsis and saves lives.\n\nDamian's team uses a mixture of R and Python to get work done. Damian confided that he was rather fond of Python himself.\n\nAfter talking with Damian I'm also watching him for something else besides Data Science. Damian appears magically produce surplus time which allows him to achieve so much. He's built and sold companies, he makes a point to always have side-projects in the works, he's a top Kaggler (https://www.kaggle.com/damianmingle/competitions), and after all this Damian makes time to meet with people. I've got to figure out *this* secret!\n\n*Rob Harrigan - 247Sports*\n247Sports is a small Data Science shop that recent was purchased by CBS Interactive. The main product from 247Sports is in tracking high school sports and providing statistics for things like college sports recruiting. \nRob's role at at 247Sports is quite interesting - he is an aspiring \"unicorn\". One of Rob's mentors once told him that people with specialized knowledge in Data Science are valuable, and people with specialized knowledge in Data Engineering are valuable - but that there is no one who has specialized knowledge of both Data Science and Data Engineering. *\"These people are unicorns. They don't exist.\"* So this is exactly what Rob decided to become.\n\nRob's specific role is in monitoring the users' engagement with the website and determining how to keep them engaged. And true to his *unicorniness*, this role involves both Data Engineering work (building services and pipelines in AWS using Terraform, Docker, Flask, etc.) and Data Science (using scikit-learn, seaborn, numpy, etc.). Rob stressed the importance in his career of positioning himself always in the *middle* of fields. He intentionally finds no-man's-lands where they shouldn't be, and positions himself right there in the middle.\n\nRob also had an interesting take on the notion of the term \"Data Science\" - he believes that the term is over-hyped and we will soon see the term fall away; it will be seen as something of a synonym to \"magic\". However Rob believes that Data Science as a field will nevertheless have a healthy future, it will just be under different branding. As business better understands Data Science, it will split into specialized sub-fields that have more specialized and meaningful names.\n\n*Overall Learnings*\n\n   - Python is a great place to start out. All three of these individuals use Python tools including Scikit-learn, seaborn, numpy, pandas, pyspark.\n   - A common concerns I found in all my conversations is that good data is hard to come by and Data Science is often forced to make do with whatever data is available. So when you think \"this is impossible, I simply don't have the data I need\" - that might be as good as it's going to get. You have to be resourceful.\n   - You don't have to go to Data Science school to be a data scientist, but you do have to be good with math. The above people are a materials engineer, a philosopher, and an image processing engineer respectively. This gives me hope as a former Aerospace guy. :D\n\nThanks Sharon, Damian, and Rob for your time! I learned a lot.\n\n-John\n",
        "date": "Wed, 2 Nov 2017 14:36:37 -0800",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 70
  },
  {
    "title": "A Lunch Chat with Jason Myers",
    "description": "",
    "date": "2017-11-10T16:01:00-08:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "For many, Jason Myers is a sort of role model in the Nashville software development scene. I know most of the people that he's worked with in recent years, and his good reputation resonates whenever his name comes up in conversation. So I was thrilled to spend a couple of hours with Jason over lunch and hopefully absorb a good idea or two. Here are some of the interesting things that I picked up from our conversation.\n\n*Always be Learning*\nJason reads constantly; he also reads with variety. For instance I was talking with him mostly about software development, but towards the end our our conversation I discovered that Jason also has a deep interest in Theology. Who knew!? I asked Jason for a list of his top reads for software development. When I get them I'll try and remember to post them back here.\n\nJason is also a \"permanent\" student at Lipscomb University, picking up courses here and there that he finds interesting. Jason confided that he's not terribly interested in graduating. He just wants to absorb something new.\n\n*Always be Working on a Side Project*\nJason has tons of side projects. He has helped organize several conferences and meetups (Nodevember, PyTennessee, PyCon, PyNash). He serves as the maintainer for virtualenvwrapper (https://bitbucket.org/virtualenvwrapper/virtualenvwrapper/). Soon he will publish his second book (Essential SQLAlchemy (http://shop.oreilly.com/product/0636920035800.do) being the first). And he has put together several courses with DataCamp (for instance Introduction to Relational Databases (https://www.datacamp.com/courses/introduction-to-relational-databases-in-python)\n).\n\nHow can Jason have so many interesting side projects? I'm not quite sure! But I think it has something to do with limiting frivolous time expenditures; picking the right projects (interesting and impactful); and if possible, working with people that share your vision. And most of all, I think a secret is just to get started! Most people miss that step.\n\n*Help People*\nJason, despite being a self-ascribed introvert, regularly takes lunch and coffee chats with people (one or two a week). He provides advice, helps connect people, and teaches. I've even been the benefactor of this in the past: Jason helped connect me to Eventbrite where I currently work! A neat benefit of helping others is that you get to know people. This is useful!\n\n*Slow but Steady Wins the Race*\nI often think of the best programmers as being able to efficiently churn out code. Jason takes a different tact. He's efficient because he is *thorough* rather then fast. His current employer was initially surprised that he didn't crank out code more quickly. But rather than quick, Jason prefers to make sure that all the appropriate interfaces and corner-cases are thoroughly tested. In doing so Jason releases very few bugs in his code and over even a short period of time the effects of this practice upon Jason's efficiency become obvious. Additionally, clean code, clear interfaces, and good tests makes Jason's code easier to work with for others, so Jason's thoroughness soon turns into an efficiency boost for those that work near to him.\n\nThanks for good conversation Jason. Let's do it again!\n\nJohn\n",
        "date": "2017-11-10T16:01:00-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "And lookey what I got. Jason's recommended reading list.\n\nIn his words:\n\nhttps://www.amazon.com/Pattern-Oriented-Software-Architecture-Concurrent-Networked/dp/0471606952\n>\n> https://www.amazon.com/Refactoring-Improving-Design-Existing-Code/dp/0201485672\n>\n> https://www.amazon.com/Coders-Work-Reflections-Craft-Programming/dp/1430219483\n> I love all 4 of http://aosabook.org/en/index.html but the 500 lines is a > blast\n> https://www.amazon.com/gp/product/0735611319/\n> That’s my 5 I guess  That’s leaving off these:\n>\n> https://www.amazon.com/Code-Complete-Developer-Best-Practices-ebook/dp/B00JDMPOSY\n>\n> https://www.amazon.com/Structure-Interpretation-Computer-Programs-Engineering/dp/0262510871/ref=sr_1_cc_1?s=aps&ie=UTF8&qid=1510359905&sr=1-1-catcorr&keywords=sicp\n>\n> https://www.amazon.com/Elemental-Design-Patterns-Jason-Smith/dp/0321711920/ref=sr_1_1?ie=UTF8&qid=1510359943&sr=8-1&keywords=elemental+design+patterns\n>\n> https://www.amazon.com/Programming-Pearls-2nd-Jon-Bentley/dp/0201657880/ref=sr_1_1?ie=UTF8&qid=1510359989&sr=8-1&keywords=Programming+pearls\n\n",
        "date": "2017-11-10T18:17:21-08:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 71
  },
  {
    "title": "Learning how Brains work with David Simon",
    "description": "",
    "date": "2018-01-23T21:08:08-08:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "It's been a while since I had a Penny Chat, but last week has had to great opportunity to set down with David Simon and talk about how his neuroscience research using EEGs to understand how humans combine visual and auditory information. I had so much fun that I wrote a blog post! http://blog.jnbrymn.com/2018/01/21/brain-waves/\n\nCheers!\nJohn\n\nP.S. David, if you have anything to add or papers to direct us to I'd be excited to learn more!\n",
        "date": "2018-01-23T21:08:08-08:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 72
  },
  {
    "title": "Kaggle challenge (grocery sales data) with Data Nerds",
    "description": "",
    "date": "2018-01-31T19:31:28-08:00",
    "user": "leechanghsin@gmail.com",
    "followups": [
      {
        "content": "On Monday I had a chance to chat with 3 of the Data Nerds: Alex Antonison, John Berryman, and Chad You.\n\nI asked about how was the grocery sales challenge for the data nerds and what did they learn. John said that he used the challenge to get *very* familiar with pandas, and got started in using Keras, a neural network/deep learning framework that I had no experience in. \nA particular question I asked on the challenge was how they imputed the sales data. In my opinion, retail sales are tricky because the missing data can come from different sources --- it could be due to actual missing data or the items went out of stock. Alex, Chad, and John described they used different ways to impute the data, like taking median or means from other values, and we got into a conversation on how to impute different kinds of datasets if we know some context on the data.\n\nOne idea was to chop the data up into strips and take the mean or median in each strip if there is missing data, as shown in image (by John & Chad). \nhttps://i.imgur.com/LEwMWd7.jpg\n\nAnother method of imputation is to fit a model on the missing dependent variable from other variables and impute accordingly, but a linear model might not work well if the data doesn't look linear. We didn't dive too deep into it as we went out of time.\n\nBonus:\n1. Alex recommended a nice podcast called Linear Digressions: http://lineardigressions.com/\n\nI haven't listened to but the topic list looks really solid. The learned tree paper was probably the hottest paper in the machine learning world in the last 3 months, so I'll definitely listen to that episode.\n\n2. I learned that moustache wax the key to *great* handlebars.\n\nThanks Data Nerds!\n",
        "date": "2018-01-31T19:31:28-08:00",
        "user": "leechanghsin@gmail.com"
      }
    ],
    "id": 73
  },
  {
    "title": "Quick overview on Keras with John (3/5/18)",
    "description": "",
    "date": "2018-03-11T15:56:40-07:00",
    "user": "leechanghsin@gmail.com",
    "followups": [
      {
        "content": "Last week, I have been exploring Keras for autoencoders on time-series data, so John showed me his gist (hey John, do you want to share it?) on a simple Keras model for a simulated time series data with a sequential model API. \nIn my first attempt to use Keras with Tensorflow backend, the most confusing part was to get data into the right shape. So seeing how he converts the data into a the right tensor shape that Keras uses was helpful. I got my first Keras pipeline to work later that day!\n\nHe also told me he read that LSTMs are good for picking up time series patterns. I'm using convolutional networks right now, and LSTM seems to be a natural next step.\n\nHere are two links from John -\nhttps://keras.io/getting-started/faq/#how-can-i-use-stateful-rnns\nhttps://machinelearningmastery.com/use-different-batch-sizes-training-predicting-python-keras/\n\n\nBonus: I have a talk coming up in a few days, so I asked John what was his process in preparing a talk. He said that he'd come up with everything that's related to the topic, then refine from there. I took the approach and got my slides down. We'll see how the talk goes :D\n\nChang\n",
        "date": "2018-03-11T15:56:40-07:00",
        "user": "leechanghsin@gmail.com"
      },
      {
        "content": "Here is the Keras example that I was working with https://gist.github.com/JnBrymn-EB/1eacd73e1d73f329c6e3f84b931577e2. I am learning Keras myself right now and like Chang I thought that getting the tensor shapes correct was really difficult. I finally figured things out by creating a toy data set and figuring out how to make it learn the pattern in the data. Now I'm currently applying what I learned to the Kaggle Toxic Comment challenge https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge I'm *attempting* to use LTSMs to learn a language model based on training from these comments.\n\nAs always, nice chatting with you Chang!\n\n",
        "date": "2018-03-11T18:05:17-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 74
  },
  {
    "title": "Will Acuff talks about Building Relationships and Improving Communities",
    "description": "",
    "date": "2018-04-16T20:18:19-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "I had a very different kind of a Penny Chat today. I sat down with Will Acuff of Corner to Corner to discuss how to improve communities by building relationships. I blogged it! http://blog.jnbrymn.com/2018/04/16/will-acuff-penny-chat/\n",
        "date": "2018-04-16T20:18:19-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Oh yeah. I meant to give you a link to Will's organization as well. Here you go! https://www.cornertocorner.org/\n",
        "date": "2018-04-16T20:19:14-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 75
  },
  {
    "title": "Unity3D with Tanner Netterville",
    "description": "",
    "date": "2018-08-23T19:27:05-07:00",
    "user": "leechanghsin@gmail.com",
    "followups": [
      {
        "content": "*A Unity3D Penny Chat*\n\nI've been working on a Unity lake simulator for a side project.As a Unity noob, there are two questions after I finished a few tutorials that I feel will take a long time to figure out. \n1. How do I calculate the distance between the boat and the terrain (shores, trees etc)?\n2. How do I save the camera view to file?\n\nSo I set up a Penny chat with Tanner. The chat saved me at least 20 hours of research time. Here's how.\n\n*Question 1: finding distance*\n\nFor question 1, he showed me that I can calculate distance between objects by a method called raycasting which is common in older FPS games. \nThe idea is that you can attach a laser pointer to a game object, and the output of this laser pointer includes the distance, parameter, where it was it etc. This is how FPS games determine whether there is a hit or not! I had no idea it existed.\n\nOnce I modeled the terrain, I can set up a raycast object from the camera to get the distance between camera and the terrain. This is perfect! But there is a little catch - because the rays are stopped by colliders, I need to set the layer masks so the rays can penetrate the right objects. \n(Live coding footage from Tanner -> I didn't know about the bitwise operator thing <<)\n\n <about:invalid#zClosurez>\n\n\n\n*Question 2: render to image*\n\nFor saving camera view to object, he showed me this thread:\nhttps://answers.unity.com/questions/37134/is-it-possible-to-save-rendertextures-into-png-fil.html\n\nBasically, render the view to texture, then convert to Texture2D, and finally, call the encoding to image methods.\n\nNow I just need to figure out the right frame rate, and a good way to record the distance along with the images (maybe code it into filenames?)\n\n*Other tips*\n\nI was having navigating inside my Scene View in the Unity Editor. Tanner says the shortcuts he used the most are\n\n* Left click to select\n* Right click to rotate\n* Middle click to drag the view\n* Alt left: Drag camera on orbit\n* Alt right/mousewheel to zoom in or zoom out.\n\nThis is incredibly helpful to me because I spent quite some time setting up the right perspective to work on the objects.\n\nPS. After Tanner showed me the shortcuts, I googled and found that there is actually a manual page for it -\n\nhttps://docs.unity3d.com/Manual/SceneViewNavigation.html\n\n**What's super cool about Tanner**\n\nHe is developing a VR game! The game is set to launch in less than a month in September 2018. Check it out on steam store!\n\nAs a VR enthusiast, I asked him what was one thing that he found different in developing VR games than developing pancake (flat-screen) games. \nHe said that\n 1. The concept of control is different in VR. Instead of mapping actions to controller buttons, you spend more time to think about what can be done and what feels \"natural.\"\n\n2. There are few visual tricks that won't work in a VR game. An example is that overlaying several flat images to create a nice flame with particle effects. It works very nice in pancake games. In VR (roomscale), however, once you step to the side, the flame looks... flat, and the trick doesn't work. \nHe also mentioned that the SteamVR plugin in Unity asset store is a great resource on building your first VR game, as they have coded away a lot of the development hurdles for VR. This is a good time to dive in a try it out!\n\nThanks a lot Tanner!\n\n",
        "date": "2018-08-23T19:27:05-07:00",
        "user": "leechanghsin@gmail.com"
      },
      {
        "content": "Here's the link to the game:\n\n*Chop it* https://store.steampowered.com/app/812580/Chop_It/\n\n",
        "date": "2018-08-23T19:29:31-07:00",
        "user": "leechanghsin@gmail.com"
      }
    ],
    "id": 76
  },
  {
    "title": "A Chat on Software/Data Science Testing",
    "description": "",
    "date": "2018-12-30T17:15:52-08:00",
    "user": "leechanghsin@gmail.com",
    "followups": [
      {
        "content": "\n\n*How it got started?*\n\n\nI put out a blog post on pytest and a discussion started in the Slack Channel. Besides the testing frameworks, how and what to test for in developing a product was a question that had been haunting me for a long time. \nWhen you have a question, the best way to get an answer is...ask people. So I decided to set up a penny chat over lunch time and learn from everyone's experience on testing.\n\n\n*Who's in the chat*\n\n\n   - Alex Antonison\n   - Chad You\n   - Chang Hsin Lee\n   - Rob Harrigan\n   - Scott Burns\n   - Stephen Bailey\n\n6 people representing 5 different teams!\n\n*What we talked about*\n\n*1. Testing applications *\n\n\nRob started by talking about how to test applications—\n\n   - Separate business and functional layers. Write more functional tests.\n   - Makes it safe to refactor by knowing what the assumptions are.\n   - Test coverage as measure (Codecov (https://codecov.io/),  coverage.py (https://coverage.readthedocs.io/) in runnable with Python)\n   - Setting up mocks. If anyone has good resource please provide\n   Getting Started with Mocking in Python (https://semaphoreci.com/community/tutorials/getting-started-with-mocking-in-python)\n   *2. Testing data pipelines*\n\nThen we talked about other aspects of data science. In particular, how can we test data?\n\n   - Great_expectations (https://github.com/great-expectations/great_expectations)\n   - Testing in the context of data is closer to monitoring than software testing\n   - Stephen mentioned that there are 3 kinds of things to test:\n   1. One is for development (mostly unit tests). Very important because    you’re likely to build stuff on-top of this.\n   2. Scheduled Reporting. Still important, reporting function should be    written in a way to take any kind of data and report on that. So a test    could build simple data and verify the correct report is generated.\n   3. One-off analyses. Likely tough to test and of little value    (however, if you begin to share functions between analyses, consider    extracting into a library and testing those functions).\n   *3. Unit tests*\n\n\nWe talked about how we write unit tests, then Rob mentioned a Python package that the developer can define and equation and test random test cases.\n\n\n\n   -    Hypothesis (https://hypothesis.readthedocs.io/en/latest/)\n   \n*Note:* I talked about writing assertions, then Rob pointed out that asserts can get compiled away in Python, see https://dbader.org/blog/python-assert-tutorial so it's safer to use “if not” instead of “assert” in production Python jobs. \n*4. How to encourage the habit of writing tests? How to justify the business value of writing tests?*\n\n\nI asked another question: how can you justify the business value of writing tests to the managers?\n\n   - How it’s rolled out in axialHealthcare (Alex, Chad)\n   - Get everyone using GitHub first. GitHub GUI is more user friendly than command-line Git for data scientists who have never done any version control (Scott). - Implement basic CI/CD and reject pull request if test fails. But start from very basic CI (Scott).\n   - Write you test example and show to your team\n   - Style check\n   - Self checking\n   - Continuously testing\n   *Two great insights from Scott:*\n   - *Time *is the destroyer of your applications and models. Over time, things change, and these changes will break, so testing becomes more and more important the longer you plan to use something.\n   - Tests are a way of formalizing “tribal knowledge” about the ways a problem or project can go wrong.\n   *Additional sources*:\n\n7 Common Types of Software Testing (https://usersnap.com/blog/software-testing-basics/)\n\n\n*This review is the result of our collaboration on Google docs*\n\n\n\n",
        "date": "2018-12-30T17:15:52-08:00",
        "user": "leechanghsin@gmail.com"
      }
    ],
    "id": 77
  },
  {
    "title": "The Shifting Domain of Data Engineering and Data Science",
    "description": "",
    "date": "2019-01-29T20:35:40-08:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "\n\nA few weeks back Andrew Ng posted a Twitter commentary on the emerging changes in data science and data engineering.\n\n\n\nI made an off-hand comment to Alex Antonison, Ryan Carr, and Chang Lee that this is the conversation that we've been having over and over for the past half year or so. Chang decided to toss out the message on Penny U slack and it turned into one of our biggest Penny Chats in a long time, attended by 8 data scientists and data engineers from all over the country. (Only 3 of us were in Nashville at the time!)\n\n\nThe topics were interesting, as expected we are *all* running into similar problems. Here are some points that jumped out to me from the conversation:\n\n\n   - How are people deploying models?\n   - Docker is being used to containerize models so that you don't have    to worry about conflicting dependencies.\n   - The interface is HTTP JSON request in and JSON response out.\n   - Amazon SQS is used to queue streaming prediction requests.\n   - Reproducibility of results. Should you really just keep all the data that was used to train the original data set? That's what some companies do!\n   - How to monitor model quality assurance?\n   - great_expectations    (https://github.com/great-expectations/great_expectations) applies    tests to data to make sure it maintains appropriate characteristics on a    row level and on a higher level (e.g. statistical distribution for example)\n   - We talked about pain we're feeling with pipeline management and    especially with models that depend upon other models\n   - Several of us are investigating canned solutions for model management (\n   SageMaker (https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html) and H20.ai)\n   - Communication - lots of issues here:\n   - When data scientists create a model, how do they communicate the    existence of the model to product people? How do they communicate the    limitations in the model?\n   - How do data scientists  talk with business people about how a model    works so that they can assess business risk of using a model?\n   - How do data scientists communicate to engineers in order to get a    model deployed and make sure it makes sense.\n   - Knowledge capture - models are complex, have different expectations of the input data, provide different interpretations of output - how do we capture this information so that the next data scientist an data engineer understands the model well enough to maintain and extend it?\n\n\nAs you can tell, it was a great Penny Chat! Here are the raw notes. (https://docs.google.com/document/d/1Sri8koko0-E-lXeIVaKld9fhe9had1_p6vd43fHP2uA/edit?usp=sharing) (I *did* record a video of the chat, but unfortunately the audio unusable.)\n\nI maintain that a book on this subject would be very timely! \nI had fun guys! Let's do it again!\n-John\n\n",
        "date": "2019-01-29T20:35:40-08:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 78
  },
  {
    "title": "Welcome to Penny University - Again!",
    "description": "",
    "date": "2019-01-31T21:37:20-08:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "Greetings!\n\n*Tonight is special.* I just met with several Penny U old-timers and a couple new member with the goal to reignite Penny University. Change is in the air!\n\nMany of you were around to see Penny University from the start – a peer-to-peer learning community designed to pull people into in-real-life meetings for the sake of sharing knowledge. From the beginning, our community was well received. People were excited about the idea of loose mentorship relationships, just-in-time-learning, and meeting new people that share their interests. *The community was engaged.* Penny Chats happened several times a week, occasionally with very large groups. And people wrote about it – we have over 70 Penny Chat reviews posted on pennyuniversity.org.\n\nThere appears to be a \"critical mass\" dynamic to a community like this – If enough people are participating, then the excitement around the community feeds itself and people will continue to participate and invite others. Unfortunately several of our most dedicated members became unavailable around the same time, and several more moved away. Penny University did not achieve critical mass and eventually cooled off.\n\nFortunately, a kernel of this community lives on and is still quite active on slack. (Feel free to join us on penny-university.slack.com.) And we've learned some things from our experience.\n\n   - In-real-life meetings are great (and will continue), but Google Hangouts work just as well, and sometimes better – for example, you can screen share and record.\n   - Our geographically distributed membership can be used to our advantage. We have a network of experts spread across at least 5 states. Connect the mentor you need no matter where they live.\n   - There is a big push within many companies to provide mentorship and continuing development for their employees. Penny University is positioned to serve this niche. Tell us if you're interested in promoting Penny U at your company.\n   - The tools we've borrowed to build the community have served their purpose well (Slack, Google Groups/Hangouts/Calendar), but in time we will learn enough to start replacing some these tools with our own platform.\n\n\n*Would you like to become involved?*\n\nIt's as easy as it ever was! Pop into slack and tell us what you're here to learn. We'll point you in the right direction. From there it's up to you! Buy a coffee, grab a lunch, or set up a Google Hangout. Then – *and this is important *– tell the mentor thanks by writing up a short summary of what you learned and dropping it in the pennyuniversity.org forum. This is also a great way to reinforce your learning and to teach the community a little bit of what you learned.\n\nI hope to hear from you soon.\n*Welcome back to Penny University.*\n\n\n\n",
        "date": "2019-01-31T21:37:20-08:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 79
  },
  {
    "title": "Getting Started with Podcasting: A conversation between Rodney Norris and Tim Dobbins",
    "description": "",
    "date": "2019-02-02T09:38:15-08:00",
    "user": "tmthyjames@gmail.com",
    "followups": [
      {
        "content": "\n\nGetting Started with Podcasting: A conversation between Rodney Norris and Tim Dobbins\n\n2019.01.25\n\nThis was a \"Penny Chat\". Penny University is a distributed, self-organizing, peer-to-peer learning community. Learn more about Penny University here. (http://pennyuniversity.org) I’ve recently been toying with the idea of starting a podcast. During my research phase, I’ve been in conversations with multiple people from various domains to make sure this is something I can commit to and sustain. One of my conversations was with Rodney Norris of nashdevcast.com fame. Although this conversation was planned to be about what I need to get started, it covered a lot more. Here are some highlights of our conversation:\n\n\n   -    What equipment do I need to get started?\n   -   If you’re doing remote interviews, then you really only need to make    sure you and your guest has headphones and a mic (computer mic should work    fine).\n   -   If you’re doing in-person interviews, then things get a little more    complicated as you’d need a dedicated mic for each participant instead of    just one mic for everyone. Apparently this can cause some problems and    sacrifice some sound quality.    -   Podcasting apps like Anchor may work. I’m in the process of trying    this and will report back with results. But at first glance it looks to be    very easy to set up.    -    How much prep time should you plan for?\n   -   One should spend a minimum of 30-60min preparing for an interview;    this will vary depending on the topic/guest.    -   Prep time should not be limited to content/conversation preparation.    -  Be sure to research rigorously\n  -  Create a theme/narrative that you’d like to follow\n  -  Create an outline and bullet points to make transitions smooth and   natural\n  -  Set up recording equipment in advance\n  -    What should the schedule look like?\n   -   This will depend on many things, but the most important thing is to    maintain consistency. If you release a podcast episode every week, then    don’t miss a week.    -   Some general rules: weekly episodes involves a lot of work. Rodney    found that for him and his team, bi-weekly episodes were best for    everyone's’ schedules.    \n   -    Post production (this is where most of your time will be spent):\n   -   Try to limit editing as much as possible.    -   First pass editing: mute irrelevant noises like background noise.\n   -   Software packages like Premiere and Audition are great for editing.\n   -   To reduce editing, Rodney recommended canned intros and outros. This    also gives the audience a familiar cue to listen for at the beginning/end    of episodes.    -   For recording remotely with 2 people, Zen Raster works well. If    recording remotely with more than 2, Zoom works well.    -   An episode should max out at 4 people. With more than 4 people,    things get messy and too many people talking at once.    -    How long should episodes be?\n   -   Shoot for 30-45 min episodes.\n   -   Keep an eye on time and know when to wind down naturally.\n   -   Don’t try to be rigid with time; let things flow naturally with your    theme.\n   -    Whoever you want your audience to be, cater to them.\n   -    Other similar Podcasts of interest that one could learn from:\n   -   Ruby Rogues (https://devchat.tv/ruby-rogues/)\n   -   Developer On Fire (https://developeronfire.com/)\n   -   Bikeshed (http://bikeshed.fm/)\n   -   Yak Shave (http://yakshave.fm/)\n   -    Tim: is having episodes in coffee shops/bars a good idea to incorporate ambient sounds in the background? -   Rodney: You should hold off on these environments until you have the    equipment to pull it off--microphones that can limit the background noise    (can get expensive).    ",
        "date": "2019-02-02T09:38:15-08:00",
        "user": "tmthyjames@gmail.com"
      }
    ],
    "id": 80
  },
  {
    "title": "Competitive Coding with Lauren Gibbs",
    "description": "",
    "date": "2019-02-07T21:03:13-08:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "At one point I thought it would be fun have a \"Code Olympics\" where teams could form and spend a day trying to tackle various coding challenges while an audience cheered them on. Turns out competitive coding has been a thing for a long time, and fellow Penny U member Lauren Gibbs is into it in a big way! Since I might be interested in bringing this culture to Nashville at some point, I had Lauren set down with me today and explain what competitive coding is all about.\n\n*The details:*\n\n   - Rules\n   - Participants form teams, typically of 3 people\n   - Competitions last 5 to 8 hours\n   - Coding challenges\n  - At the beginning of a competition each team is given the same   set of 8 coding challenges, each printed on a single sheet of paper   - For each challenge you will build a program that reads data from   a file and writes the answer as output to another file.\n  - At the top of the page is the challenge description.\n  - Followed by an explanation of input\n  - Followed by an explanation of output\n  - Followed by a sample input and output\n  - See the attached \"problem_example.jpg\" for an example.\n  - Available tools:\n  - Participants are not allowed to connect to the internet (their   cell phones are also left at the door)\n  - Participants are only given access to a shell. So all edits are   done in VIM!\n  - Participants have access to the typical build and run tools for   all common languages.\n  - Participants may bring anything the want *on paper* (kinda like   those tests I hated in college).\n   - Judging\n  - All programs must run within a specified time limit.\n  - As soon as a team finishes a problem they submit the output to   the judges who then tell them only if the answer is correct or incorrect.   - If the answer is incorrect then the team is penalized. They   will have 15 minutes reduced from their competition time.\n  - Every time a team gets a challenge correct they get a balloon   tied to their chair so that others know how well they are faring.\n  - The winner of the competition is whichever team has solved the   most challenges by the end of the competition. If there is a tie then the   winner is whoever submitted the last answer earliest.\n  - *Typically a team will be able to submit 3 or 4 answers in the   course of a competition. (Lauren's team averaged about 5.) It was very rare   for a team to submit all 8 answers!*\n  - Strategy\n   - Though not require by rules, teams often have specialized members:\n  - algorithmist - this person reads the problems an creates   pseudocode for solving the problem\n  - typist - this person transcribes pseudocode to working code that   can be built and run (this was Laura's role)\n  - debugger - this person pairs with the typist and helps them find   issues with the code or algorithm\n   - Approach:   - At the beginning of the competition the team reads and sorts the   challenges from easiest to hardest\n  - Great tip/trick: While the algorithmist starts to work on the   first challenge the typist writes up a makefile that will be used for   building all the code - Lauren's makefile is attached.\n  - After the team gets into the flow solving one problem at a time,   each performing their specific role\n   \nBack in college, Lauren used to actually travel around for these coding competitions! Until recently switching jobs, Lauren hosted casual (2-3 hour) coding competitions at her employer's office using https://open.kattis.com/ to organize the events. She said 10 or so people would regularly show up and it was quite a bit of fun.\n\nAfter our Google Hangout, Lauren followed up with me in email. She had one parting comment \"Participating in competitive programming is my #1 recommendation for preparing for technical job interviews. They are essentially the same thing.\"\n\nI live in Nashville. Maybe it's time to bring coding competitions to here!\n\n*Thanks again for your time Lauren.*\n\n\n",
        "date": "2019-02-07T21:03:13-08:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Quick correction - Lauren's role on the team was the \"algorithmist\" rather than the typist as I said above. However Lauren underscores the importance of the typist's role because they are the only person that actually writes code!\n",
        "date": "2019-02-08T06:48:36-08:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 81
  },
  {
    "title": "PennyU Presents GitHub Actions",
    "description": "",
    "date": "2019-02-13T13:22:45-08:00",
    "user": "scott.s.burns@gmail.com",
    "followups": [
      {
        "content": "\n\nGitHub Actions\n\nLinks\n\n   -    You can watch this Penny Chat at https://youtu.be/PWzvZE-lqjg\n   -    Scott’s slides can be downloaded from http://sburns.org/assets/pdf/GitHubActions_PennyU_20190205.pdf\n   \nBroad Strokes\n\nGitHub Actions let you define scripts that should automatically run in response to activity in the system. It requires no hosting on your part. Your scripts run in a Docker container with easy access to the repository.\nSummary What we went through in the chat:\n\n\n   -    Webhooks\n   -    Actions\n   -    Q&As\n   -    An example of Action in Action\n   Webhooks\n\nBefore going into Actions, we went through the idea of Webhooks.\n\nA webhook in GitHub is how I can notify other systems when an event happen. Events are interactions with GitHub, such as * Push - a PushEvent\n\n* Pull request - a PullRequestEvent\n\n* Issue - an IssueEvent\n\nIn continuous integration and deployment (CI/CD), the idea is that there will be various checks on the quality of software when there is change in the code repository. We want to make sure this merge does not break things! This change then creates an event that triggers a series of action on other places outside of GitHub through HTTP POST requests with a JSON payload. Hence the \"hook.\"\n\nLink to the guide on webhooks: https://developer.github.com/webhooks/ Based on this idea, there are many third party service providers on GitHub for CI/CD e.g. TravisCI. But now GitHub be like: hmmmm we can probably let our users do it on our platform too. Actions GitHub Actions provide a framework to let you define \"what do you want to do\" on Github when one of the events occur through scripts. Each action is a chain of scripts, or rather, a tree, that is triggered by an event. Scott showed us an example of an action in action 👀 so watch the video especially the part near the end of it.\n\nContext of the Actions How do I define the environment of where my code runs? Right now it is defined through Docker containers, so the actions are associated with either\n\n* A Docker image, or\n\n* A Dockerfile that GitHub can use (either within the repo or in a public repo)\nPotential Use Cases\n   -    Could use GitHub actions as a means of CI for machine learning models.  In the event a new model gets pushed to a PR, could have an Action kick off to run model metrics to see how the new model would compare to the existing model.\n   -   A limitation of this would be that GitHub actions do have certain    hardware and timing limitations so would need to ensure that the prediction    code could run within the time window.\n   To learn more about actions (still in public beta!)\n\n* https://developer.github.com/actions/\n\n(Chang’s notes)\n\n\n",
        "date": "2019-02-13T13:22:45-08:00",
        "user": "scott.s.burns@gmail.com"
      }
    ],
    "id": 82
  },
  {
    "title": "Flask Apps for Data Science",
    "description": "",
    "date": "2019-02-16T03:07:03-08:00",
    "user": "stkbailey@gmail.com",
    "followups": [
      {
        "content": "\n\nHey all --\n\n\nWaaaay back when I was a PhD student, I attempted to grok Flask unsuccessfully. I couldn’t quite make the transition from a notebook-based to an application-based approach to analytics. I had the good fortune that Jason King found this out and fixed it. Flask is a Python tool that lets you build microservice applications: minimalistic programs that data scientists can deploy and leverage to accomplish repetitive analytic tasks -- like making predictions. (Of course you can use them to build very complex applications as well.)\n\nWe walked through the process of building and deploying a model that made predicitons on the “iris” dataset. You can find the code in a GitHub repo here: https://github.com/pilotneko/flask_api_template. The steps are:\n\n\n   1.    Initialize and train a model. You’ll need to make note of the shape and types of the data in your training set.\n   2.    Pickle the model to a file. `sklearn` has a `joblibs` module that can facilitate this.\n   3.    Build your Flask application script. The magic. When you start your Flask server, the code in this script runs. For our application, we need to do three things:\n   1.   Load the model and define feature order.\n   2.   Define the functions we want to be available (predict, predict_proba,    get_classes). The new issue at play with these functions is they need to    return data that can be serialized, such as JSON blobs rather than pandas    DataFrames.\n   3.   Start the server.\n   4.    Set up routing. Once you’ve defined the functions, you need to map these to specific domains using the `@app.route` decorator. This is that lynchpin between running a script and working with an application: instead of passing data directly to a function, we post it to an address which runs the function. 5.    Deploy the application. To run it on a local machine, you simply open a terminal and call `python app.py`. To deploy it on the cloud, you would push the code to it, and then start the server.\n   6.    Hit it! Now, you can send data to your server -- in the example, you would create a JSON blob of your training set using `jsonify(df.to_json())` then POST it to `localhost:8000/predict`. You’d return the predictions for that data. That’s it! There’s a lot more infrastructure required than for a typical notebook, but the Flask app is portable and consumable by a much broader audience. I know for me, personally, I’m pushing to get more of my work into an application-driven workflow and this Penny Chat was immensely helpful. Another resource aimed at data scientists: http://www.datacommunitydc.org/blog/2014/02/flask-mega-meta-tutorial-data-scientists Thanks, Jason!\n\n\nStephen\n\n",
        "date": "2019-02-16T03:07:03-08:00",
        "user": "stkbailey@gmail.com"
      }
    ],
    "id": 83
  },
  {
    "title": "Penny University Meeting Notes",
    "description": "",
    "date": "2019-03-05T21:19:47-08:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "Periodically, members of the Penny U community meet together to talk about ideas for improving the community. I've been keeping notes for these meetings. Here, check it out! (https://docs.google.com/document/d/1bKz6mIUr-et-_pAoDGL7G6RtsCynC441F9mAx1dpHuU/edit?usp=sharing)\n\nThe discussion tonight was interesting. We enumerated the different types of interactions people have with Penny University:\n\n   - Sharing topics to teach and learn about.\n   - Find people with whom you can learn about those topics.\n   - Organizing a Penny Chat\n   - Actually meet for Penny Chat\n   - Post Penny Chat reviews\n   - Review what others have written\n\nAfter enumerating these interactions, one deficiency that we zoomed in on is that we have no real on-boarding process. \n   - Where do you share topics that you're interested in? - How do you find people to learn with?\n   - What are the community expectations around any of the above actions?\n\nAnd in asking these questions we identify more and more things that we need improve.\n\nFortunately, we *are *improving these things! But we need your input so that we can see ourselves with new eyes. If you haven't visited in a while, pop back into http://penny-university.slack.com and see what we've been up to. AND if you see something that you're unsure about. Ask us. *Ask me!*\n\n\n*Learn and Teach,*\nJohn Berryman\n",
        "date": "2019-03-05T21:19:47-08:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 84
  },
  {
    "title": "Career Chat with John Berryman",
    "description": "",
    "date": "2019-03-08T11:09:16-08:00",
    "user": "nick.chouard@gmail.com",
    "followups": [
      {
        "content": "Last Friday, I had the pleasure of grabbing coffee with John Berryman. John currently works at Eventbrite in Nashville, and founded PennyU. As someone primarily focused on software development, I was interested to hear his perspective on the data science industry and his journey throughout his career. Our conversation went in many directions (my fault, as there were so many things I was curious about), but he made some specific points that I think are beneficial for our community to hear.\n\n*There is no single way to become a data scientist. *Data science is still a new field in technology, and the path to become one is not yet well defined. John started as an aerospace engineer, before eventually transitioning to being a search specialist. He describes his job now as a combination of data engineering, application development, and data science. You certainly do not a need a formal education to get started in the world of data; there are plenty of tools and resources to start learning and doing interesting things with data sets. Of course, the more you hope to do in the field, the more education you will need to pursue. Masters programs and PhDs are required for certain jobs. John pushed the importance of involving yourself in the community, as there are plenty of people in Nashville who would be happy to pass on their knowledge.\n\n*There is a wide spectrum of data science careers. *Three varieties that John loosely described are data engineers, data analysts, and data scientists. Data engineers primarily focus on building pipelines for data and maintaining the integrity of it. He described data analysts as \"detectives\". They use the data to answer questions about businesses and help them make decisions. Finally, data scientists generally use data sets to create models and make deeper inferences and connections. These jobs rely heavily on mathematical and statistical knowledge.\n\n*Sometimes you have to resign from bringing in new ideas.* John mentioned that when he started his job at Eventbrite, he was incredibly eager to establish the ideas he had. However, this caused him to ignore some of the good ideas that were already in place, and to not completely understand why they were moving in that direction. If he were to do it again, he would be more patient with his new ideas, and instead focus on understanding the ones that already exist, so that he could present his own ideas more effectively down the road.\n\nConversations like these remind me how broad and exciting the field of technology is. If you are interested in learning about someone's job or experience, I highly recommend you reach out to them to learn more about it.\n\n--Nick Chouard\n",
        "date": "2019-03-08T11:09:16-08:00",
        "user": "nick.chouard@gmail.com"
      },
      {
        "content": "That last point \"Sometimes you have to resign from bringing in new ideas.\" I need to write a very long blog post on that. For about 2 jobs in a row, I lead with \"here are great ideas and everybody should stop what they're doing and check out these cool ideas!\" Inadvertently I distracted from good work that was already happening and I didn't know enough about my job to do the \"new cool\" ideas effectively. ... If I had to do it over again I would have lead in with focused effort on delivering against existing ideas. In doing that I would have gained the trust and context needed to better deliver on the the \"new cool\" ideas in the proper time.\n\nSo I wouldn't say you have to \"resign\" from bringing in new ideas. Rather, be a team player, build up trust by delivering on other's goals, and then when the time is right, bring in the new ideas!\n\nIt was a nice discussion Nick. I appreciate having another community builder in Penny University :D\n\n~John\n\n\n\n",
        "date": "2019-03-09T15:27:23-08:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 85
  },
  {
    "title": "Techniques of preserving privacy in data sets with Stephen Bailey.",
    "description": "",
    "date": "2019-03-19T21:31:27-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "\n\nI've recently become interested in learning more about privacy-preserving recommendations, and by proxy I've been interested in the neighboring fields of federated learning, k-anonymization, randomized response, and other related areas. Ever since starting to work at Immuta, Stephen Bailey's life has been consumed by these things! So I set down with him for a Penny Chat and a preview of an upcoming talk on these topics. Here are some of the neat things I learned:\n\n\n   -    There is a tradeoff between accuracy and privacy. If you want a data science method to have maximal accuracy then you really need all the data, the RAW data. But, as we'll see below, you can throw away data, hide the identity of users, and still have relatively accurate recommendations.\n   -    \"Identifiers\" are anything that uniquely identify you - your name, address, phone number, social security number, etc. But \"quasi-identifiers\" are groups of data that sneaky people can use to uniquely identify you. For instance I might be the only \"John\" in Mount Juliet, Tennessee with a Birthday on September 15th 1980. If someone finds a dataset with those fields, they would be able to uniquely identify me and pull out all the other data associated with me.\n   -    Dealing with identifiers isn't hard, you can obfuscate them by just hashing them to a unique identifier.\n   -    Dealing with quasi-identifiers is trickier because they are usually composed of the important data. If you hash someone's age then you make the data worthless! So this is where the tradeoff between accuracy and privacy comes in. Here are some examples of reducing accuracy to make it harder to identify a person while still preserving the value of the data:\n   -   Bucket ages. If a person is 27, say that they are in their 20s.\n   -   Generalize tags. If a person is interested in Salsa music, say that    they are interested in Latin music.\n   -   Truncate IP addresses. If your IP address is 184.60.341.424… then    let's only record 184.60.*.*\n   -   The goal is to make sure there are at least k people in each bucket    so that any one individual isn't uniquely identifiable. Thus this technique    is called k-anonymization.\n   -    Random Response is another way to keep a user's data private. Basically you can write code that sends user data to your servers, but in order to protect your users' privacy you regularly send back lies! You lie just enough to give your users plausible deniability - they can always say that a data point was actually one of artificial data points. However you have enough signal in the noise so that you can build your data model from the aggregated information of all your users.\n   -    Federated learning is another way of letting your users keep their private data on their machines. Instead of sending your servers data in order to build a machine learning model, you instead send the user the model and let them send you model updates. The user gets the benefit of a custom tuned model but the model updates divulge none of their personal information.\n   -    The last technique we discussed was called \"differential privacy\". This technique is uses for database queries. Basically when making an aggregate query the service will intentionally inject a \"sufficient amount\" of random noise into the result so that it will be impossible identify any one individual uniquely. But, when you aggregate over a large set of these noisy results, the information will still be quite accurate.\n   Thanks Stephen! It was as fun discussion.\n\n\n",
        "date": "2019-03-19T21:31:27-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Thanks for sharing this!\n\nI recently read an article in the ACM related to this, and found it quite interesting.\n\nhttps://cacm.acm.org/magazines/2019/3/234925-understanding-database-reconstruction-attacks-on-public-data/fulltext?mobile=false\nUnderstanding Database Reconstruction Attacks on Public Data\n\nThe article talks about how one might reconstruct data from \"de-identified\" databases - in this case, US census data. Thinking about it from that angle might also help with coming up with ways to ensure privacy.\n\n- Brian\n",
        "date": "2019-03-20T06:43:19-07:00",
        "user": "brian@stratasan.com"
      },
      {
        "content": "Great read, Brian! I think in general, data scientists (and analysts and engineers) need to be more aware of the types of attacks that people might make on your data and artifacts. I know for me, I rarely thought about what sorts of personal information engineered features might contain or how someone nefarious might try to link it some centralized aggregated data source. Times are changing though!\n\nThis article and thread has some good points re: another famous example, the NYC taxi datasets: https://news.ycombinator.com/item?idy26358 \nIf anyone wants the slides from the talk, you can find them here: *https://tinyurl.com/data-preserving-privacy  (https://tinyurl.com/data-preserving-privacy)*\n\n\n",
        "date": "2019-03-21T04:49:24-07:00",
        "user": "stkbailey@gmail.com"
      }
    ],
    "id": 86
  },
  {
    "title": "An Hour on Search with John Berryman",
    "description": "",
    "date": "2019-04-02T21:42:44-07:00",
    "user": "alexander.poon7@gmail.com",
    "followups": [
      {
        "content": "*Background:*\n\nI’ve been working on something in the search and recommendation space for legislation. The idea is to facilitate civic engagement by first applying Natural Language Processing to extract information from 10000s of pieces of legislation, then making recommendations of legislation that someone might want to pay attention to based on criteria related to a user (e.g.: I work in education, so would be interested in bills pertaining to education). John Berryman, search professional, kindly agreed to introduce me to Elasticsearch, and walked me through some initial steps toward building something user facing for this project.\n\n*Elasticsearch basics:*\n\nIn Elasticsearch parlance, a *document* is one unit to be made searchable. In my case, each bill is a document. A collection of documents with similar properties is called an *index*.\n\nMy documents are mostly text plus metadata for each bill, e.g.:\n\n```\n{\n    'bill_id': 'HB 10',\n    'session': 109,\n    'title': ‘Students - As enacted, requires a student, during the student's high\n   school career, to take a United States civics test.',\n    'subjects': ['Education'],\n    'text': 'An act to amend Tennessee Code Annotated, Title 49, Chapter 1; Title\n  49, Chapter 2 and Title 49, Chapter 6, relative to civics education.\n  Tennessee Code Annotated, Title 49, Chapter 6, Part 4, is amended by\n  adding the following language as a new section: Beginning on January\n  1, 2016, to graduate from a public high school with a regular\n  diploma, a student shall pass a civics test composed of the one\n  hundred questions that are set forth within the civics test\n  administered by the United States citizenship and immigration\n  services to persons seeking to become naturalized citizens. The\n  department of education shall prepare a test comprised of the\n  questions described in subsection and shall disseminate the test to\n  all LEAs. A public high school shall provide each student with the\n  opportunity to take the test as many times as necessary for the\n  student to pass the test. A student shall not receive a regular high\n  school diploma until the student passes the test. A student shall\n  pass the test if the student correctly answers at least sixty percent\n  (60%) of the questions.',\n    'committee': 1,\n    'voted_down': 0,\n    'passed': 1,\n    'unanimous': 0,\n    'did_not_sign': 0\n}\n```\n\nTo index a collection of documents, I define a *mapping*. A mapping defines how the properties of the documents are treated by Elasticsearch. (A subset of) my mapping looks like this:\n\n```\n'properties': {\n    'session': {\n     'type': ‘integer’\n    },\n    .\n    .\n    .\n    'subjects': {\n     'type': 'keyword'\n    },\n    'text': {\n     'type': 'text',\n     'fields': {\n  'english': {\n   'type': 'text',\n   'analyzer': 'english'\n  }\n     }\n    },\n    'committee': {\n     'type': 'integer'\n    }\n    .\n    .\n    .\n}\n```\n\nThe different type arguments define how users are able to search against properties. Since my bill text and title fields are specified as text fields with the English analyzer (https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-lang-analyzer.html#english-analyzer), those fields will be tokenized, stemmed, and have stop words removed. Searching against text fields will return any documents containing any search terms in those fields, which is how one would typically think of interacting with search. In contrast, keyword properties like subjects are left as is, so to search against those fields a user has to specify the exact values.\n\nTo perform a search, I create a *clause *using a structure like the following:\n\n```\n{\n    'query': {\n     'bool': {\n  'must': [],\n  'should': [],\n  'must_not': [],\n  'filter': [],\n     }\n    }\n}\n```\n\nA user then populates the `must`, `should`, `must_not`, and `filter` fields with terms, or conditions to be evaluated against the properties of the of the documents. For instance, a user might want a numeric property to fall within a certain range. `must`, `should`, and `must_not` are then used to score documents based on how well they meet the criteria. `filter` is strictly used to include or exclude documents based on the specified criteria.\n\nNext up: turning this into something user facing with Flask.\n\nThanks John! I owe you a coffee.\n",
        "date": "2019-04-02T21:42:44-07:00",
        "user": "alexander.poon7@gmail.com"
      }
    ],
    "id": 87
  },
  {
    "title": "So you want to write a book? A conversation with Manning author John Berryman",
    "description": "",
    "date": "2019-04-07T08:39:47-07:00",
    "user": "tmthyjames@gmail.com",
    "followups": [
      {
        "content": "\n\nThis conversation was a \"Penny Chat\" with Manning author John Berryman on the process of writing a book. John is co-author of Relevant Search (https://www.manning.com/books/relevant-search) and had some great pointers on the entire process of writing a book.\n\nBut first, a word about Penny University (https://groups.google.com/forum/#!forum/penny-university), a distributed, self-organizing, peer-to-peer learning community. From it's website:\n\nThe name \"Penny University\" is a reference to the early coffeehouses in Oxford England. These coffeehouses held an important association with the European Age of Enlightenment. For the price of a penny, scholars and laypeople alike would be given admittance to the coffeehouse, enjoy an endless supply of coffee, and more importantly enjoy learning through conversations with their peers. Thus these coffeehouses came to be called \"Penny Universities\".\n\nOur new group, Penny University, serves as a modern take on this old tradition by connecting those who desire to learn with those who are willing to share what they know. This can certainly be at a coffeehouse, but anywhere else as well, including just a quick Google Hangout.\n\nI've been hanging around Penny U for a couple months now and have noticed that it's essentially a emergent ordering (https://en.wikipedia.org/wiki/Spontaneous_order) of curious learners and teachers where each is learning and teaching simultaneously. The following is the product of the underlining idea behind Penny U. Go check it out and reach out to someone to learn something new!\n*What to write about* \n\nBefore you write a book, you need to have a topic in mind. I was curious if you should write a book without being an expert. John advised against this. While it's possible to write a book on a subject which you're not an expert in, you'll likely spend most your time doing research. And since you're not an expert, you're likely to have holes in your thinking which may be obvious to experts in the field.\n\nAfter you have our topic, you should begin the story boarding process to produce an outline which increases in depth as you begin fleshing out the details and stitching the narrative pieces together.\n*Market evaluation*\n\nThis is where you decide if the world is ready for your book. John says you should ask why the book is needed. Does it fill a gap in the market place of ideas? Who's the target audience? What does a typical reader of your book look like? This is the stage where you answer these questions to ultimately decide if the process is worth pursuing.\n*Time commitment* \n\nWhile times may differ for completing a book, John mentioned that the process for him lasted one year. During which, his Saturdays were spent at coffee chops, and a few hours here and there throughout the week were dedicated to writing and editing. During this year, John also had a few other time-consuming tasks pop up in his life. Because of which, he advised to budget time wisely—something will always come up.\n*Solo vs collaboration*\n\nThis may differ for many folks, but John was convinced that writing with a partner is the way to go. Writing is a team sport, he said. So choose someone who you trust and are close with that will hold you accountable and motivate you. The collaboration acts as social pressure to keep pushing onward when things get difficult, boring, etc.\n*Role of publisher* \n\nI was curious about his process. Doe the publisher reach out? Do you reach out? How does this connection happen? In John's case, a publisher reached out to someone in his network and that person passed on the opportunity but mentioned John, and his co-author Doug Turnbull (https://twitter.com/softwaredoug?lang=en), who accepted the challenge. The role of the publisher is to find reviewers, keep a schedule, and in general coordinate efforts across various tasks and people.\n*Align your book topic with your work* \n\nAligning your book topic with your line of work can help you make more money in the long run, whether through direct monetary benefits like consulting gigs or through making a name for yourself in a particular field and consequently leveling up. The money you get paid from authoring a book isn't as much as you'd think, John said. After all, the publisher gets ~90% of money from sales, leaving only 10% for you (or you and your collaborators!). Your best bet is to align your topic with your line of work and therefore earn more money indirectly—that's how you maximize your payout.\n*Why write a book anyways?* \n\nWhen John told me why he wrote this book, it reminded me a lot of one of my favorite authors Christopher Hitchens and why he said he became a writer (https://www.youtube.com/watch?v=Hty8vc5sy_w)—because you're so passionate about the subject matter that you *have* to write; you have no other choice. And this passion, John said, is key to keeping you motivated. If you're writing about a topic that you're only mildly interested in, then you'll likely lose momentum. But if you're writing about a topic that you are absolutely passionate about, then you just may finish the book after all. Also, writing for money isn't enough to make the process worth it either. A prerequisite to writing a book seems to be an undying passion about the subject matter.\n\nThanks, John! This gives me a ton to think about.\n",
        "date": "2019-04-07T08:39:47-07:00",
        "user": "tmthyjames@gmail.com"
      },
      {
        "content": "I also had a blast talking with Tim about my experience. It was a walk down memory lane.\n\nHere's my quick commentary:\n\nYes, be *pretty much* an expert, but realize that there will always be holes. And in a weird way, writing a book is a great – if not exhausting – way to fill in those holes. When we started writing the book, Doug and I were expert in building relevant search experiences, but our tooling was Solr rather than Elasticsearch. Since both Solr and Elasticsearch were based on the Lucene library, and since we had *some *experience with Elasticsearch, we were confident that our approach would translate to the new technology. So we took a chance, leaned upon our expertise (the core of the book), and wrote all of the examples in Elasticsearch.\n\nIn the process of writing, I learned a ton - about my subject matter, about the process of writing, and about myself. So my favorite part of the conversation was when Tim asked me what I wish I had known before I started. My answer - *nothing*. I think that book writing is one of those things where the more you know, the more you realize what a difficult task you have ahead of you and the more reasons that you can think of to not do it. I'm glad I wrote the book! Moral of the story: if you get a chance to accomplish a dream jump at it and don't look too hard for reasons why you can't.\n\n*Emergent Order*\n\nI'm not sure why Tim brought up emergent order, but by golly he nailed it. The goal of Penny University is to be a petri dish of possible ways for building a community of social learners. And I think we're getting there. Tim is exploring his own take on this, he's organizing Penny University's for book group. In the coming weeks we'll be reading Andrew Trask's book Grokking Deep Learning (https://www.manning.com/books/grokking-deep-learning). I'm looking forward to Tim's new experiment for our group. You should join us too!\n\n",
        "date": "2019-04-07T16:06:50-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 88
  },
  {
    "title": "Data Science Career Chat with Rob Harrigan and Chang Lee",
    "description": "",
    "date": "2019-06-08T09:30:21-07:00",
    "user": "ray.a.matsumoto@vanderbilt.edu",
    "followups": [
      {
        "content": "\n\nOver the past few months, I’ve had the opportunity to chat with Rob Harrigan and Chang Lee.  Rob Harrigan is currently a senior machine learning engineer at CBS interactive, and Chang Lee is a data scientist at Lowe’s. I was interested in chatting with Rob and Chang, as they both successfully transitioned from PhDs at Vanderbilt to a career in data.  As someone who is currently pursuing a PhD in chemical engineering at Vanderbilt, I wanted to hear more about their experiences transitioning from academic researchers to data scientists in industry. Below are few of the many takeaways I learned from these two chats.\n\nRob and Chang had varying degrees of hard skills they brought with them from PhD to industry.  Rob was a contributor of distributed automation for XNAT (DAX) during his time at Vanderbilt, and as a result had skills in Python, data pipelining, and Git.  On the other hand, Chang’s PhD in mathematics was more theory-based, and his only previous experience in programming was with Matlab. Through an internship, he was able to learn R programming and data science concepts.  Despite the differences in experience, both believed one of the best skills they obtained from a PhD was the ability to pick up new skills in a timely manner. Both described situations in their academic research where they spent months tackling a specific problem, and then had to pivot and pick up new concepts and skills to answer a new problem.\n\nThe big takeaway I received from these two conversations is how diverse the field of data science is, and how differently each company approaches data science.  At CBS interactive, Rob described his data science team consisting of a combination of data engineers and data scientists. He described that data scientists on his team spend their time developing models to solve specific problems with data sets, while data engineers are tasked with building data pipelining and employing these models on a larger scale.  When Rob first started his data science career, he tried to do everything, and this is not an approach he would recommend. On the other hand, Chang described that data engineering roles don’t really exist at Lowe’s. Rather, the data scientists are tasked with providing end-to-end solutions to problems, where they are in charge of gathering the necessary data, developing a model, and then deploying and maintaining that model in production.  Despite the different experiences, both Rob and Chang shared with me the value of developing a specific set of skills that will allow you to fill a specific need on a data science team.\n\nRob and Chang also gave some great general advice for anyone interested in breaking into the field of data science.  Rob stressed the importance of working on side projects you are truly interested in to help you learn. Several years ago, he worked on a web scraper to get fantasy football picks from Reddit.  Although the project wasn’t successful in helping him win any fantasy football leagues, it was a topic of conversation that helped him land his first job at CBS interactive. Similarly, Chang expressed the importance of maintaining a personal website and growing a footprint online.  Blogging is a great way to do this, and if no-one reads your blog, at least you have written documentation on skills you’ve picked up over the years. Overall, I appreciate Rob and Chang taking the time out of their schedules to chat with me.  If you’re interested in learning more about a career in data science, I recommend reaching out to both of them to learn more about their experiences.  Furthermore, I’ve enjoyed reading their blogs (Rob: https://unsupervisedpandas.com) (Chang: https://changhsinlee.com) and also recommend checking them out as well.\n",
        "date": "2019-06-08T09:30:21-07:00",
        "user": "ray.a.matsumoto@vanderbilt.edu"
      }
    ],
    "id": 89
  },
  {
    "title": "Building Penny University with the help of Penny University (featuring Nick Chouard and Rob Harrigan)",
    "description": "",
    "date": "2019-06-12T21:40:21-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "I'm working with Nick Chouard and, as of tonight, Rob Harrigan to build out pieces of Penny University. So far, me and Nick have tossed together a simple bot framework and created a \"greeting bot\" in Slack (https://github.com/penny-university/penny_university). If you join Slack PennyU as a new member you'll get a message from the bot welcoming you to the Slack team and giving you some of the highlights of Penny University. Soon we plan to add functionality wherein the bot will catalog the interests of our members, recommend people to learn with, and help arrange meetings. Besides building out the bot, we would also like to have a landing page and something better than Google Groups for our Penny Chat reviews!\n\nTonight was particularly exciting because Rob Harrigan joined us. As I screen shared and showed Rob our code, Nick took notes of every time that Rob gasped in dismay (Rob is a pro at deployment and a security fanatic - both things that we haven't really focused on :-/ ). As a result, we now have a list of all the things we need to work on to make our website is both easier to deploy and more secure. We even started improving things tonight – Rob showed us how to containerize our project. It's not hard!\n\n*How to Dockerize a Django Project*\n\n1) Install Docker (docker-for-mac is great on a mac)\n2) Make sure you have a requirements.txt file in the same folder as manage.py\n3) Add Dockerfile to that same directory. Ours looks like FROM python:3\n\nWORKDIR /usr/src/app\n\nCOPY requirements.txt ./\nRUN pip install --no-cache-dir -r requirements.txt\n\nCOPY . .\n\nCMD [ \"uwsgi\", \"--http-socket\", \"0.0.0.0:80\", \"--wsgi-file\", \"penny_u_django/wsgi.py\", \"--master\", \"--processes\", \"4\", \"--threads\", \"2\"]\n\nNOTE! We're using uwsgi rather than ./manage.py runserver. (This was another place where Rob had gasped in dismay. Runserver is insecure.)\n4) Build the image with docker build -t my_new_image\n5) Run the app: docker run -p 80:80 -e SOME_ENV_VAR=1234 my_new_image\n6) You should be able to connect with this: http://127.0.0.1/\n\nOne thing I'm pretty excited about: this is a great example of how we are using the Penny University community to gain the skills we need build the Penny University platform.\n\nThanks Rob, for the easy intro to Django in Docker and I look forward to crossing off all the other items in our list!\n\nIf any of you in the community are interested in helping us build the PennyU platform then start a conversation in #meta-penny\n",
        "date": "2019-06-12T21:40:21-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 90
  },
  {
    "title": "GraphQL crash course with Nick Chouard",
    "description": "",
    "date": "2019-09-16T20:01:30-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "GraphQL has been popping up on my tech radar for about a year. Since my work at GitHub will occasionally touch GraphQL I decided to take Nick up on an offer to learn more. Here's some of the big ideas:\n\nGraphQL is somewhat like REST in that it provides a pattern for accessing data.\n\nAlso like REST, GraphQL isn't a new *technology* or a new library or something. Rather it's a *specification* and a set of guidelines about how and API can be built. It's up to the application developer to build out all the internals. Fortunately there *are* libraries that can help do this much the way that a Django ORM helps you connect to a database. \nREST has some weak points:\n\n   - The API designer has to plan out all the endpoints up front. For instance she might make an endpoint to access online classes as /classes and the students in a particular class, 123, might be /class/123/students. The *problem* is that the order of access is fixed. If you want to list all the classes for a student, then you have to put in the work of creating a new endpoint; something like: /student/456/classes. Things get worse and worse as your data model gets more complicated.\n   - The next problem is that the data you get back from a REST endpoint is fixed and might not be what you want.\n   - If you want to call /class/123 you'll get back information like the    class name, a syllabus, a list of student ids. But maybe you don't need all    that. You just need the name and the list of students. Syllabus's are often    several KB in length and are stored on a different server than the rest of    the data. Why get all this information if you don't need it?\n   - Similarly, if you want the list of students for class 123, you'll    be sad to find out that the that /class/123 only returns the student    ids. You'll then have to either make a new request to    /class/123/students or in the worst case send individual requests to /student/X    for each student id. Ouch.\n   *Introducing GraphQL*\n\nIt's a weird, JSON-like syntax that looks like this:\n\n{\n  classes(id\u00123) {\n    name\n    students {\n   name\n    }\n  }\n}\n\nThis query says roughly \"Of all the classes locate #123, and then for that class give me its name and its students. Oh, and for the students, I don't need all their information, just give me their name.\n\nThe result would come back something like \n{\n  \"classes\": [{\n    \"name\": \"Underwater Basket Weaving\",\n    \"students\" [{\"name\": \"John Berryman\"}, {\"name\": \"Chang Lee\"}, {\"name\": \"Nick Chouard\"}]\n  }\n}\n\nAnd based on the GraphQL syntax, you could ask potentially arbitrary things. For instance, for each student that takes class 123, you might be interested in finding the topics of all classes the other classes that they take. This query would get the topics of all those classes:\n\n{\n  classes(id\u00123) {\n    students {\n   classes {\n     topic\n   }\n    }\n  }\n}\n\nThis is interesting because classes reference students which reference classes again. There's no way you'd ever see this in a sane REST API (\n/classes/123/students/classes ?!)  but it's reasonable in GraphQL.\n\n*The \"big problem\" though*, is that you've still got to implement the backend. GraphQL is just a language specification. It knows nothing about your databases or tables. Fortunately though, there are some fairly refined solutions for common web app libraries. For example Django has a GraphQL library set up so that you can write just a few small classes and it will automatically construct the GraphQL API that gives you the flexibility described above.\n\nI learned a lot tonight. Thanks for your time Nick!\n-John\n",
        "date": "2019-09-16T20:01:30-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 91
  },
  {
    "title": "Technical Leadership w/ Scott Burns",
    "description": "",
    "date": "2019-09-18T04:18:47-07:00",
    "user": "stkbailey@gmail.com",
    "followups": [
      {
        "content": "\n\nLast Friday, a few of us had the chance to chat with Scott Burns on the topic of Leadership in an engineering organization. We covered a variety of topics, and I’ve selected a few of the personal highlights for this review -- hopefully others will chime in as well.\n\n*First things first: *leadership is not the same as management, and management is not necessarily leadership. There are several actions that overlap between good management and strong leadership, such as: the ability to persuade, build alignment among people, empathy, taking ownership, and clear-headed definition and pursuit of goals. However, a lone developer can practice these things as well as a VP of Engineering. *Next:* One set of practices does not fit all contexts. Companies are groups of people, and people are dynamic, ever-changing and constantly surprising. Therefore, companies are all these things -- and more. One way to approach finding the right actions to take to advance your team’s goals is to experiment. Treat your context as a black box, and manipulate the input to see how the output changes.\n\nFor example, these are all questions that can have an outsize impact on the work of a team: - What is the best way to organize and review your team’s work? Sprint, Kanban, or something else? - What systems should you use to track tasks and communicate: Jira or Asana? Should all communication take place on GitHub or on Slack?\n   - How should you submit data products to stakeholders? Powerpoint presentations? Should you transition to Tableau?\n\nThese are actually very important questions, but there may not be a “Right” answer -- as a leader, you should adopt a “try and see”, and find out what works in your context. THere has to be some degree of commitment and push behind the idea, but forgive yourself if it fails, summarize what you learned, and try something different.\n\n*Finally: *communication is the foundation of leading others, no matter your role or situation. Knowing who are the stakeholders (so that your message can get to the right place), and how they can best be communicated with (so that it comes at the right time), will make sure you are maximally efficient with the effort you put in to push a project forward. Further, a leader is always selling -- they must get others invested in a common goal, assure people that it is valuable, and be able to adapt to new developments.\n\nGreat chat, Scott et al.! Look forward to the next one.\n",
        "date": "2019-09-18T04:18:47-07:00",
        "user": "stkbailey@gmail.com"
      },
      {
        "content": "This was a lot of fun, I appreciated the chance to talk about these things!\n\nIf you decide to make the jump, the first obstacle you'll find is that there is a lot less material on the internet about how to improve as an engineering manager. While there are *plenty* of \"Learn React in 15 minutes\", \"Deploy a serverless blah blah blah on AWS\", etc technical articles all over the place about how to learn a particular tool, there's a dearth of material around, for example, helping a direct report cope with issues at home. In general, management is much more contextual and leans heavily on emotional intelligence, skills that years of being an Individual Contributor can weaken (though I'd argue that high-EQ ICs are extremely valuable). What this means is that you're not going to find a turn-key solution for any of your management problems as they're all highly contextualized to the people, teams and organizations involved. The best you can do then is to try to understand how leaders with more experience make decisions, the factors they consider, and the outcomes they're trying to hit. A few resources that I've really liked:\n\n*  The Eng-Managers slack team (https://engmanagers.github.io/) is highly diverse and the members discuss their interesting problems of the day. While I contribute a small amount, I've learned a lot merely by keeping up with threads and understanding how other people would approach problems.\n* The Managers Path (https://www.amazon.com/Elegant-Puzzle-Systems-Engineering-Management/dp/1732265186) by Camille Fournier is required reading for anyone considering management. It lays out the career progression, starting at IC, through tech-lead, line manager, manager-of-managers through CTO, heavily discussing the differences between each.\n* Will Larson's new The Elegant Puzzle (https://www.amazon.com/Elegant-Puzzle-Systems-Engineering-Management/dp/1732265186) is a very technically-based perspective on management and discusses team structures, career progression, etc all from the perspective of someone who clearly remains a very technical thinker.\n* Managing Humans (https://www.amazon.com/Managing-Humans-Humorous-Software-Engineering/dp/1430243147) by Michael Lopp is an amalgamation of posts from randsinrepose.com. There's less of a tight narrative in this book, but its very easy to pick it up, find an interesting chapter and come away with an interesting perspective on a particular problem.\n\nThank you Stephen for wrangling schedules!\n\nScott\n\n",
        "date": "2019-09-18T06:26:32-07:00",
        "user": "scott.s.burns@gmail.com"
      },
      {
        "content": "I also enjoyed the Penny Chat.\n\nOne of my takeaways was the \"aspects of leadership\" thread. These included\n\n   - - Persuasion - be able to lead through encouragement and through non-coercive means. Managers have \"authority\" but should be reluctant to use it. Authority is a sharp tool which can be used to achieve certain ends, but it is a tool that dulls quickly with use.\n   - Building alignment across different people/groups so that work is additive (rather than allowing different groups to work against one another)\n   - Forming coalitions across teams. This helps in alignment but also, these people provide information, awareness of surroundings, and advice.\n   - Being able to identify other leaders even/especially among people without the \"manager\" title. Finding and befriending an influential individual contributor can make a manager's job a lot easier.\n   - Supporting people, standing up for people, fostering them.\n   - Building a feeling of ownership among the people you lead\n   - Having the mile-high view of situations and being able to understand what *can* be accomplished, so that you can make good decisions about where to place your effort.\n   - Being able to describe what success looks like but then get out of the way.\n   - Being able to deliver bad news, particularly when something can't be achieved.\n\nThanks Scott!\n",
        "date": "2019-09-18T07:19:49-07:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 92
  },
  {
    "title": "Model Drift in Production",
    "description": "",
    "date": "2019-09-30T12:12:36-07:00",
    "user": "adantonison@gmail.com",
    "followups": [
      {
        "content": "Model Drift in ProductionAttendees\n\nBettyAnn - Data Scientist at HCA (https://hcahealthcare.com/)\n\nJeremy Jorden - Data Scientist at Proofpoint (https://www.proofpoint.com/us)\n\nBren Letson - Retired\n\nAlexander Antonison - Data Analytics Manager at Stratasan (\nhttps://stratasan.com/)\n\nData Drift at Proofpoint\n\nData drift at Proofpoint is constant.  Proofpoint is a people-centric cybersecurity company that believes as enterprises shift to the cloud, people are the weakest link now.  Overall networks are more secure but people are still at risk of phishing via e-mail or social media. Jeremy’s team works with teams within Proofpoint to identify opportunities to build models that can help protect their customers from these threats.   However, there is an adversarial aspect to this because as a model performs better at detecting a threat campaign, the threat actors will adjust their campaigns to try and trick the models, leading to an arms race between threat detection and generation of new threats.  On top of their models, there are other non-ML solutions in place also looking for threats, as well as human review.  Jeremy mentioned they addressed this by building features that are robust to this.  As new data is collected, they will retrain their models as often as possible to better catch new threats.  They also relabel the data on which their models are trained. They have reduced the retraining time down between retraining to pushing to production to be a short turn-around.\n\nWhen asked about “how do threat groups adapt?”, Jeremy mentioned they treat threat campaigns like a business, if they notice they are getting lower success rates, they will start to experiment to see what adjustments they can make to create a more successful new campaign.\nData Drift at HCA\n\nHCA owns 180 hospitals across the US and in the UK.  Most facilities’ electronic medical records (EMRs) are Meditech (https://ehr.meditech.com/) but there are also some other vendors such as Epic (https://www.epic.com/) and Cerner (https://www.cerner.com/ (https://www.cerner.com/?)).  Data drift at HCA can occur for various reasons. For example, changes made to the EMR system can result in dramatic and unexpected changes in data. Or hospital patient populations changing over time resulting in more subtle changes.  Most models do not need to be retrained constantly whereas a handful of models are retrained quarterly because of changes related to CMS’s bundled payments programs (\nhttps://innovation.cms.gov/initiatives/bundled-payments/) for a given hospital.  The retraining process at HCA is not streamlined therefore it is not convenient to retrain a model. Given the need to balance project requests with the capacity of the Data Science department, retraining models may require justification.\nBroader Discussion about detecting Data Drift\n   -    If you have methods in place to evaluate model performance, it seems that detecting data drift is not as necessary since you could rely on a decline in model performance to be an overall indicator for data drift.\n   -   I (BA) had an “aha” moment now that I understand this point (data    drift vs model performance).  In my mind, I didn’t see a difference between    data drift and model performance. I viewed them as two sides of the same    coin: when data drifts, the model’s performance will change (more than    likely change toward less accurate).  Or perhaps another way to put this    is, I saw the result of data drift (the input to models) as being poorer    model performance (the output of models).\n   -    If you need to retrain frequently because of constantly changing data, the detection of data drift does not seem as important since models will be constantly retrained.\n   -    By making the process of retraining more automated and streamlined, it has helped at Proofpoint allow for more frequent retraining.\n   -    Build business intelligence tools that show.\n   Reactive vs Proactive\n\nDetecting data drift in the feature space allows a Data Scientist to be proactive about retraining models.  Depending on the need for being proactive about model retraining, it may be sufficient to be reactive where you evaluate model performance and wait for instances where a given model starts to be less accurate which could be an indicator for retraining.\n\nBettyAnn indicated model metrics that could be used to indicate that a model should be retrained.  For example, BettyAnn uses the terms capture, over-capture, and under-capture rates when discussing model accuracy with her business owners. [BA I refer to this wiki page weekly: https://en.wikipedia.org/wiki/Confusion_matrix]). Various methods were discussed to detect when a model needs retraining and how to justify the time needed to retrain.\n",
        "date": "2019-09-30T12:12:36-07:00",
        "user": "adantonison@gmail.com"
      }
    ],
    "id": 93
  },
  {
    "title": "Building Penny University by USING Penny University --- Developer Community Engagement",
    "description": "",
    "date": "2019-10-30T19:23:12-07:00",
    "user": "jfberryman@gmail.com",
    "followups": [
      {
        "content": "Nick Chouard and I have been spending a lot of time working behind the scenes on a new technological foundation for Penny University. You've *hopefully* seen the new website (http://pennyuniversity.org) and if you've joined recently, you should have also received our greeting message and interests questionnaire. We've got plenty of other things in store for you soon - *and they will be more visible!*\n\nBecause of these developments we've decided to start looking beyond technology and into the very different domain of community building. Since Nick and I aren't experts in this domain, we reached outside of the community (... *or maybe we pulled into the community *😏* ...*) some world class expertise on the subject of community building. We spent 30 minutes today speaking with Lina Tran and Brady Gentile, community builders and promoters for Hedera Hashgraph (https://www.hedera.com). In the quick brainstorming session we came up with TONS of new ideas. Here are just a few:\n\n   - *\"Find places where your potential members are already hanging out.\"* - Our members are people that enjoy learning and teaching. Our members enjoy doing this socially. Our members are technologists. Our members are going to have a presence on Slack. *Therefore* we have some ideas where we our future members might hang out:\n   - Places of learning:   - Speak at universities for developments clubs.\n  - Talk with computer science professors, and their classes.\n  - Work with bootcamps (looking at you @marylvv and Nashville   Software School)\n   - Talk at tech meetups, *especially* meetups that are associated with    Slack team.\n  - Nick mentioned that BUDS, a Belmont dev club that he founded.\n  - I'm starting to speak about Penny U. Ex:   https://www.meetup.com/PyNash/events/265491950/\n   - Tech podcasts - can we get a spot?\n   - *\"We are our own target audience.\"* - If Nick or I want to know how it feels to be \"promoted to\", we don't have to go far. We are good examples of our own members. This will help us think through promoting Penny U to others. Oh! One key point here that is obvious but bares repeating - *people don't like being sold to!* If Penny U is to be adopted, it will be organically and it will be because people see value in it. Paying people to promote Penny U would fail because it would feel inauthentic.\n   - *\"Make sure questions are answered.\"* - A member's first magic moment is often asking a question and getting a thoughtful response and *hopefully* a penny chat to discuss in detail. *Make sure these happen! *Penny U has a critical mass dynamic. If there are enough people focused on a single topic then almost every question that pops up will get an answer. But if we spread our community too thin then the average experience will be poor. This also informs how we grow our community. For example, eventually I hope \"photography\" and \"cooking\" have a place in the community. But if we focused so broadly now, then the average member wouldn't find enough similar people for a community to really emerge.\n   - *\"Reach outside of Penny U for experts\" *- If questions aren't getting answered on the inside, then find someone on the outside and pull them in.\n   - \"Woo the tech evangelists.\" - At all the big tech companies that    you've ever heard of, they have hired people to specifically be \"tech    evangelists\", people that promote a community around their technology. If    we ever have a question that goes unanswered, I'm going to make a point to    reach out to these people first. We have a shared incentive to find the    best answer.\n   - Automate finding people. Once upon a time I used *the power of data    science™* to build a twitter bot that could locate experts    (https://opensourceconnections.com/blog/2013/11/27/quick-start-with-neo4j-using-your-twitter-data/).    Probably time to knock the dust off of that one.\n   - A fantastic hook to bring people into the community is to let them    know that their expertise is needed! It makes people feel special to know    that their insights could help others solve problems. ... *And    hopefully that's exactly how you felt today Lina and Brady!*\n   Thanks so much Lina and Brady for your time. I hope you'll keep an eye on us and make sure we're putting your recommendations to good work!\n\nAnd to the rest of you: what are your ideas for growing the community? How can we get more people involved?\n\n",
        "date": "2019-10-30T19:23:12-07:00",
        "user": "jfberryman@gmail.com"
      },
      {
        "content": "Thanks, John and Nick — it was great catching up with you guys this week, and looking forward to watching the community grow! Giving us too much credit there with '*world class expertise' *😂but much appreciated :-)\n\n\n",
        "date": "2019-10-31T20:12:52-07:00",
        "user": "bmgentile@gmail.com"
      },
      {
        "content": "Echoing the thanks to Brady and Lina from John! This was a very informative discussion.\n\nThe most powerful moment from this chat for me was the reminder that engagement from our experts is the most important of building our community. The willingness from people to share their knowledge is what drives us, and continuously encouraging, engaging, and thanking our experts will be essential for growth.\n\n",
        "date": "2019-11-01T10:34:09-07:00",
        "user": "nick.chouard@gmail.com"
      }
    ],
    "id": 94
  },
  {
    "title": "React/Redux Architecture with Will Gaggioli",
    "description": "",
    "date": "2019-11-20T13:19:00-08:00",
    "user": "nick.chouard@gmail.com",
    "followups": [
      {
        "content": "This past Tuesday, John Berryman and I spoke with Will Gaggioli, a Principal Engineer at Eventbrite, about how to architect a React/Redux application. Will shared his best practices and insights, leaving us feeling confident in creating a clear, well-structured application of our own.\n\nWhen React first came on to the scene, it was unique amongst other frontend web frameworks in that it is based on state rather than events. When something happens on the web page, the underlying data (state) is changed, and React renders the page to reflect the changes. In vanilla React, state is stored in components, or the individual pieces that make up the page. The Flux pattern, established by Facebook, introduced the concept of global state. With global state there is a data store that is shared across your application, rather than individual pieces of state being included in the components. Redux is an implementation of this Flux pattern. While it is not necessary to use Redux (or some other state management framework) in a React application, many large projects use it to separate concerns and simplify state management.\n\nThe flow between your components and state can become quite complex, so Will presented a straightforward way to organize your frontend code. He uses the following folder structure:\n\n   - API: Any interactions with APIs will happen here. These are generally called from actions, and then may call other actions, which are described below.\n   - Components: These are pieces of \"dumb UI\". Ideally, your components should be project-independent, and decoupled from your data, so that you could reuse individual components in other applications if you wanted to. The components will be passed data and functions to display data or perform some sort of action.\n   - Connectors: Connectors are the glue between your data and your components. They mainly house two functions, *mapStateToProps* and *mapDispatchToProps*. *mapStateToProps* serves to translate your state into data that can be used by your components, while *mapDispatchToProps* is used to pass actions along to your components to use.\n   - Actions: In Redux, actions are called to modify the state. An *action* takes a payload (for example, a user's nickname), and passes that data along to a *reducer*, which then updates the state. While usually actions in Redux are often very simple, preferring to do most of the work in a reducer, there is a library called redux-thunk (https://github.com/reduxjs/redux-thunk) that can be leveraged to move most of the business logic of an app into actions. According the the Thunk docs, thunks act as middleware for your actions. The thunk can be used to delay the dispatch of an action to a reducer, or to dispatch only if a certain condition is met.\n   - Reducers: Reducers are used to update the state. They take in a payload from an action, and then return an updated state. They do not update the state directly.\n   - Selectors: Using a library called reselect (https://github.com/reduxjs/reselect), an additional layer can be added to improve the performance of your application. Without selectors, the code contained in *mapStateToProps* will run every time your component is rendered. However, if you pull the code in your *mapStateToProps* function out into a series of selectors, they will only run if the data you are interested in changes. Each selector takes in state, looks at the data you are interested in, and if it has changed, runs a function to transform the data to be used in your component. If the underlying data has not changed, it returns the previous from a cache.\n\n\nThere are many ways to organize a React application, but the above pattern provides an incredibly clear separation of concerns, and makes it easy to reason about your frontend code. A big thank you Will for giving us this walk through!\n",
        "date": "2019-11-20T13:19:00-08:00",
        "user": "nick.chouard@gmail.com"
      },
      {
        "content": "I learned a lot from the discussion too. At the end of my time at Eventbrite I got a chance to work with React/Redux and after a bit of a learning curve I found them quite comfortable to work with. (And per Will, if you're looking to learn either of these technologies, the Redux material (https://redux.js.org/basics/basic-tutorial) is awesome for learning *both* Reach and Redux. I've got through this material myself and I agree.)\n\nThe completely new things for me were redux thunks and selectors. I am just now learning them, but the basic ideas that I took away from Will is this:\n\n   - \"Actions\" in vanilla Redux are very lightweight. It's just an object with a \"type\" key and then whatever metadata you need to describe the action that just took place. There is a pain-point in vanilla wherein you don't have access to the state when you often need it during in the \"dispatchToProps\" methods. Somehow (and this is what I have to learn), Redux Thunks resolve this with some sort of heavier Action that includes a lot of the business logic.\n   - Selectors - Nick describes this pretty well above... so go read that again ;-)\n\nThanks again Will. I know why Eventbrite calls you an Archetype developer.\n\n",
        "date": "2019-11-20T14:30:34-08:00",
        "user": "jfberryman@gmail.com"
      }
    ],
    "id": 95
  }
];

export default chats.reverse();