import re

from django.core.mail import send_mail
from django.core.management.base import BaseCommand
from django.db.models import Count
from django.template.loader import render_to_string

from users.models import User


class Command(BaseCommand):
    help = (
        """Email everyone associate with Penny U and tell them that we have a new website.

        Test Run
        $ SENDGRID_API_KEY=WHATEVER ./manage.py email_members --test_email=something@gmail.com  \
            --email_file="some/file.md"

        Live Run
        $ SENDGRID_API_KEY=WHATEVER ./manage.py email_members --live_run --email_file="some/file.md"
        """
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--live_run',
            dest='live_run',
            action='store_true',
            help='opposite of dry run - will actually send emails',
            required=False,
        )
        parser.add_argument(
            '--test_email',
            dest='test_email',
            help='where to send emails to',
            required=False,
        )
        parser.add_argument(
            '--email_file',
            dest='email_file',
            help='''file containing subject and contents of the email with this format

            Subject Line
            =====================  <-- literally a line of only equals
            Markdown content of email. Currently we support _emphasis_ and [links](http://example.com)

            ''',
            required=True,
        )

    def handle(self, *args, **options):
        with open(options['email_file'], 'r') as file:
            subject_content = file.read()
            subject_content = re.split('\n={5,}\n', subject_content)
            if not len(subject_content) == 2:
                raise(RuntimeError('email file formatted incorrectly, see docs in command'))

        subject, content = subject_content

        if options['test_email']:
            users = [options['test_email']]
        else:
            # taken from the google forum
            old_forum_emails = 'abatula@gmail.com,abbyleighanne@gmail.com,acreeg@gmail.com,adamtaylor0795@gmail.com,adantonison@gmail.com,admbarn@gmail.com,adriennefranke@gmail.com,adventuressummer2016@gmail.com,ahmetfarukcakmak@gmail.com,alacker@gmail.com,alex.antonison@gmail.com,alex.simonian@gmail.com,alexander.poon7@gmail.com,alice.s.yeh@gmail.com,aliya.gifford@gmail.com,allen.goyne@gmail.com,almostsurelyape@gmail.com,ammi@carterembry.com,amritrajpatra@gmail.com,anadsmith@gmail.com,andersonkaem@gmail.com,anna.dolan115@gmail.com,ant@whenpbmetj.org,anthonyfox1988@gmail.com,astrohsy@gmail.com,barfootaaron@yahoo.com,bbeck410@gmail.com,beck@eventbrite.com,belvedmarks4@gmail.com,bengmaxwell@gmail.com,bewillou@asu.edu,bill.israel@gmail.com,bkbolte18@gmail.com,bkmontgomery@gmail.com,blarrance@gmail.com,bradley.wogsland@gmail.com,bradleytastic@gmail.com,brandonhamric@gmail.com,brewer.nathant@gmail.com,brian.costlow@gmail.com,brian@stratasan.com,brianmdoane@gmail.com,bryan.hunter@leanfp.com,bsdtux@gmail.com,bwilburnstrength@gmail.com,caitlin.teter@gmail.com,carleton.coggins@gmail.com,casey@feasttogether.org,ccummings@eventbrite.com,celliott@emmagivesback.org,cerayx@gmail.com,chaochenyou@gmail.com,chortlehoort@gmail.com,cmeador@gmail.com,cmstockton@gmail.com,codefumonkey@gmail.com,colbydehart@gmail.com,colin@camelot.fm,coreyarice@gmail.com,corkum@gmail.com,cory.kelly@4patriots.com,cras.zswift@gmail.com,daniel.j.aquino@gmail.com,daynewright.dev@gmail.com,deanna2000@gmail.com,deesplease@gmail.com,delaine.wendling@gmail.com,dengyong.ai@gmail.com,devonkinghorn@gmail.com,devyncunningham@gmail.com,dharned@gmail.com,diaz.gilberto@gmail.com,dmhalejr@gmail.com,duane.waddle@gmail.com,dwilcox81@gmail.com,edward.ribeiro@gmail.com,eeachh@gmail.com,enders.tim@gmail.com,eric.appelt@gmail.com,erik.hatcher@gmail.com,ethancharleswillis@gmail.com,facetuscompleo@gmail.com,fernandohmunoz@gmail.com,fletcherbangs@gmail.com,fonnesbeck@gmail.com,fretwiz@gmail.com,giff.h92@gmail.com,graffwebdev@gmail.com,gregormccreadie80@gmail.com,grojas@lyft.com,gtback@gmail.com,hananiel@gmail.com,ibnipun10@gmail.com,innwaelele@gmail.com,j.e.blackman@gmail.com,j.matthew.hamil@gmail.com,jacob.senecal@gmail.com,jameswtonkin@gmail.com,jason.orendorff@gmail.com,jason@muzology.com,jean.soderkvist@gmail.com,jeff.d.bowen@gmail.com,jeremythomasjordan@gmail.com,jessawynne@gmail.com,jfberryman@gmail.com,jinshelly@gmail.com,jkirbymusic@gmail.com,john.w.quarles@gmail.com,john@jmsdvl.com,johnson.jarroda@gmail.com,jonstaples314@gmail.com,joseph.hechter@gmail.com,joshlaseter@gmail.com,joshsmith.ee@gmail.com,joshuacbergstrom@gmail.com,joypratt820@gmail.com,jrshaffner@gmail.com,juliacollins10@gmail.com,jurnell@sophicware.com,justin.threlkeld@gmail.com,justinmcnm@gmail.com,karafulgum@gmail.com,katy.justiss@gmail.com,katycampen@gmail.com,kayliekwon@gmail.com,kaytaylorhume@gmail.com,kevin.w.huo@gmail.com,kevinahuber@gmail.com,kreid876@gmail.com,kumikos@gmail.com,kwelch0626@gmail.com,laurengibbs010@gmail.com,lckennedy@gmail.com,leechanghsin@gmail.com,lengau@gmail.com,lurchbulldog@gmail.com,lynn.samuelson@gmail.com,mardugalljamow@gmail.com,markellisdev@gmail.com,markzawill@gmail.com,maroberts@gmail.com,maryvanvalkenburg@gmail.com,masonembry81@gmail.com,matthew.j.cronin@gmail.com,mcskwayrd@gmail.com,melroman26@gmail.com,micha3050@gmail.com,mikeschuld@gmail.com,miranda.null@gmail.com,mjwood83@gmail.com,mnorris2@harding.edu,monroemasseybrooks@gmail.com,mtambo.dev@gmail.com,natalie.diana.hall@gmail.com,nathancbutler@gmail.com,nicholassalazar@gmail.com,nick.chouard@gmail.com,nick@codefornashville.org,nimbleltd@gmail.com,nyirka@gmail.com,odonnell004@gmail.com,paul@paulmcneely.com,paul@paulrosen.net,pdswan@gmail.com,pegbertsch@gmail.com,penny.university.mod@gmail.com,pennyuniversity@preet.am,pj@preet.am,ptndoss@gmail.com,quartertonality@gmail.com,rachelannwerner@gmail.com,rajputro@gmail.com,rashad.j.russell@gmail.com,richardthomaswhitfield@gmail.com,rittycheriah@gmail.com,rmatsum@g.clemson.edu,rob.harrigan89@gmail.com,rubiks.forever2000@gmail.com,rvansickle91@gmail.com,ryan@noisepuzzle.com,ryancdeeds@gmail.com,sabrichu@gmail.com,sam.remedios@gmail.com,sandynashv@gmail.com,sanmishr@gmail.com,sbrose83@googlemail.com,scott.brandon34@gmail.com,scott.s.burns@gmail.com,scott.southworth@gmail.com,seth.a.alexander@gmail.com,sfitch@astraea.io,sfrapoport@gmail.com,shader.jeff@gmail.com,sharon.chou.2718@gmail.com,simonw@eventbrite.com,skagawa2@illinois.edu,skaggskd88@gmail.com,slobaum@gmail.com,softwaredoug@gmail.com,spencer.meriwether.ingram@gmail.com,stkbailey@gmail.com,stock424@morris.umn.edu,tannern@gmail.com,tannerplauche@gmail.com,taylorperkins.dev@gmail.com,tdobbins@thegeneral.com,tduncklee@gmail.com,timoguin@gmail.com,tmthyjames@gmail.com,tomar.gatech@gmail.com,tommacmichael@me.com,tvvaidy@gmail.com,twillstw@gmail.com,upjohnc@gmail.com,vanzeghb@gmail.com,vargasman11@gmail.com,vishvishal49@gmail.com,vkhedkar@gmail.com,weissmanj.darden@gmail.com,wesley.l.lewis@gmail.com,weston.hunter@gmail.com,wgaggioli@gmail.com,work@nicoledominguez.com,yeager.nicole@gmail.com,zgleblanc@gmail.com'  # noqa
            old_forum_emails = old_forum_emails.split(',')

            users = User.objects.annotate(chat_count=Count('user_chats'))
            present_emails = set(user.email for user in users)
            missing_emails = list(email for email in old_forum_emails if email not in present_emails)
            users = list(users) + missing_emails

        really_send = bool(options['live_run'] or options['test_email'])

        for i, user in enumerate(users):
            send_email(user, subject, content, really_send=really_send)
            print(f"sent to user #{i}: {user}")


def send_email(user, subject, content, really_send=False):
    text_content = '{% autoescape off %}\n' + content + '\n{% endautoescape %}'
    html_content = render_to_string('users/email_to_users.html', {'content': generate_html_content(content)})

    email = user.email if hasattr(user, 'email') else user  # because user IS an email
    if email and really_send:
        send_mail(
            subject=subject,
            message=text_content,
            from_email='"Penny University" <lincoln@pennyuniversity.org>',
            recipient_list=[email],
            html_message=html_content,
        )
    else:
        print(html_content)


links = re.compile(r'\[([^\]\[]+?)\]\(([^)(]+?)\)')
emph = re.compile(r'_\B([^_]+)\B_')


def generate_html_content(text):
    # replace markdown links
    text = links.sub(
        r'<a style="text-decoration: underline; color: #0068A5;" href="\2" target="_blank" rel="noopener">\1</a>',
        text,
    )

    # replace emphasis
    text = emph.sub(r'<em>\1</em>', text)

    # wrap lines
    start_p = '''<p style="line-height: 1.2; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word; font-size: 14px; mso-line-height-alt: 17px; margin: 0;">'''  # noqa
    start_span = '<span style="font-size: 14px;">'
    new_text = [start_p]
    for line in text.split('\n'):
        if line.strip():
            new_text.append(f'\t{start_span}{line}</span><br>')
        else:
            new_text.append(f'</p>\n{start_p}&nbsp;</p>\n{start_p}')
    new_text.append('\n</p>')
    text = '\n'.join(new_text)

    return text
