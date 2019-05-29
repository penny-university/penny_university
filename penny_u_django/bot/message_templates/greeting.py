def greeting(user_id):
    message = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Welcome to Penny University, <@{id}>*".format(id=user_id)
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Penny University is a self-organizing, peer-to-peer learning community. In Penny U there are no \"mentors\" or \"mentees\" but rather peers that enjoy learning together, socially. "
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "• If you have something you can teach, then let it be known. \n • If you have something you want to learn, then reach out to the community or to an individual and ask for help - buy them a coffee or lunch, or jump on a Google Hangout. (This is called a Penny Chat.) \n • And when your Penny Chat is complete, show your appreciation by posting a Penny Chat review in our <http://pennyuniversity.org|forum>. Teach us a little of what you have learned."
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Penny U is on the move. If all goes well then I, your trusty robot sidekick, will gain super powers in the coming months. I will help you find the answers you're looking for. I will also replace our lowly <http://pennyuniversity.org|Google Groups home page> with something a little more... appealing. If you want to help use out then let <@U42HCBFEF> and <@UES202FV5> know."
            }
        },
        {
            "type": "section",
            "text": {
                "type": "plain_text",
                "text": "What happens when I click this button?",
                "emoji": True
            }
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Connect account",
                        "emoji": True
                    },
                    "callback_id": "join_penny_u",
                    "value": "click_me_123"
                }
            ]
        }
    ]
    return message


def joined(user_id, teaching_interests, learning_interests):
    message = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*<@{id}> just joined Penny University!*".format(id=user_id)
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Their teaching interests: {}".format(teaching_interests)
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Their learning interests: {}".format(learning_interests)
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Say hello, everyone!"
            }
        }
    ]

    return message
